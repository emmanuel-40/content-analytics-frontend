import { Camera, KeyRound, LogOut, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Field, Input, Textarea } from '@/components/ui/Field'
import { useAuth } from '@/hooks/useAuth'
import {
  resolveAvatarUrl,
  useChangePassword,
  useDeleteAvatar,
  useProfile,
  useUpdateProfile,
  useUploadAvatar,
} from '@/hooks/useProfile'
import { ApiError, apiClient } from '@/lib/api'
import { initials } from '@/lib/utils'
import type { UpdateProfileRequest } from '@/types/api'

export function SettingsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { data: profile } = useProfile()
  const update = useUpdateProfile()
  const uploadAvatar = useUploadAvatar()
  const deleteAvatar = useDeleteAvatar()
  const changePassword = useChangePassword()
  const fileInput = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UpdateProfileRequest>({ defaultValues: {} })

  useEffect(() => {
    if (!profile) return
    reset({
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      bio: profile.bio ?? '',
      phoneNumber: profile.phoneNumber ?? '',
      location: profile.location ?? '',
      website: profile.website ?? '',
      emailNotifications: profile.emailNotifications ?? true,
      publicProfile: profile.publicProfile ?? false,
    })
  }, [profile, reset])

  const avatar = resolveAvatarUrl(profile?.avatarUrl)

  return (
    <>
      <PageHeader title="Settings" description="Manage your profile, avatar and security." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(async (values) => {
                await update.mutateAsync(values)
                toast.success('Profile saved')
              })} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="First name"><Input {...register('firstName')} /></Field>
                  <Field label="Last name"><Input {...register('lastName')} /></Field>
                </div>
                <Field label="Bio"><Textarea rows={3} {...register('bio')} maxLength={500} /></Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Phone"><Input {...register('phoneNumber')} placeholder="+234…" /></Field>
                  <Field label="Location"><Input {...register('location')} /></Field>
                </div>
                <Field label="Website"><Input {...register('website')} placeholder="https://…" /></Field>
                <div className="flex flex-wrap gap-5">
                  <label className="flex items-center gap-2 text-sm text-zinc-400">
                    <input type="checkbox" className="accent-signal-400" {...register('emailNotifications')} /> Email notifications
                  </label>
                  <label className="flex items-center gap-2 text-sm text-zinc-400">
                    <input type="checkbox" className="accent-signal-400" {...register('publicProfile')} /> Public profile
                  </label>
                </div>
                <Button type="submit" loading={isSubmitting || update.isPending}>Save changes</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center gap-2"><KeyRound className="h-4 w-4 text-signal-400" /><CardTitle>Change password</CardTitle></CardHeader>
            <CardContent>
                <PasswordForm
                  onSubmit={async (input) => {
                    try {
                      await changePassword.mutateAsync(input)
                      toast.success('Password changed. Sign in again')
                      await logout()
                      navigate('/login')
                    } catch (error) {
                      toast.error(error instanceof ApiError ? error.message : 'Could not change password')
                    }
                  }}
                  pending={changePassword.isPending}
                />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Avatar</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-signal-500/30 bg-signal-400/10 text-xl font-bold text-signal-300">
                {avatar ? (
                  <img src={avatar} alt="Your avatar" className="h-full w-full object-cover" />
                ) : (
                  initials(user?.username ?? user?.email ?? '?')
                )}
              </div>
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (!file) return
                  uploadAvatar.mutate(file, {
                    onSuccess: () => toast.success('Avatar updated'),
                    onError: () => toast.error('Could not update avatar'),
                  })
                }}
              />
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Button variant="outline" size="sm" loading={uploadAvatar.isPending} onClick={() => fileInput.current?.click()}>
                  <Camera className="h-3.5 w-3.5" /> Upload
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteAvatar.mutate(undefined, { onSuccess: () => toast.success('Avatar removed') })}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </Button>
              </div>
              <p className="mt-3 text-xs text-zinc-600">JPEG, PNG or WebP · max 5 MB</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Account</CardTitle></CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-zinc-500">Username</dt><dd className="text-zinc-200">{user?.username}</dd></div>
                <div className="flex justify-between"><dt className="text-zinc-500">Email</dt><dd className="truncate text-zinc-200">{user?.email}</dd></div>
                <div className="flex justify-between"><dt className="text-zinc-500">Role</dt><dd className="text-zinc-200">{user?.role}</dd></div>
              </dl>
              <Button
                variant="danger"
                className="mt-5 w-full"
                onClick={async () => {
                  if (!window.confirm('Sign out everywhere? All your devices will be disconnected.')) return
                  await apiClient.post('/api/auth/invalidate-tokens')
                  await logout()
                  navigate('/login')
                }}
              >
                <LogOut className="h-4 w-4" /> Sign out everywhere
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

function PasswordForm({
  onSubmit,
  pending,
}: {
  onSubmit: (input: { oldPassword: string; newPassword: string; confirmPassword: string }) => Promise<void>
  pending: boolean
}) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  return (
    <div className="space-y-4">
      <Field label="Current password"><Input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} autoComplete="current-password" /></Field>
      <Field label="New password" hint="8+ characters with upper, lower, number and special character">
        <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
      </Field>
      <Field label="Confirm new password"><Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" /></Field>
      <Button
        type="button"
        loading={pending}
        disabled={!oldPassword || !newPassword || newPassword !== confirmPassword}
        onClick={() => onSubmit({ oldPassword, newPassword, confirmPassword })}
      >
        Update password
      </Button>
    </div>
  )
}
