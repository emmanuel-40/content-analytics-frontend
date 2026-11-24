import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'
import { ApiError, apiClient } from '@/lib/api'
import { resetPasswordSchema, type ResetPasswordForm } from '@/lib/schemas'

export function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({ resolver: zodResolver(resetPasswordSchema) })

  const onSubmit = async (values: ResetPasswordForm) => {
    try {
      await apiClient.post(
        '/api/auth/reset-password',
        { token, newPassword: values.newPassword },
        { auth: false },
      )
      setDone(true)
    } catch (error) {
      setError('root', {
        message: error instanceof ApiError ? error.message : 'Unable to reset password',
      })
    }
  }

  if (done) {
    return (
      <AuthLayout title="Password updated" description="Your new password is ready to use.">
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5 text-sm text-emerald-200">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          You can now sign in with your new password.
        </div>
        <Link to="/login" className="mt-6 block"><Button className="w-full">Sign in</Button></Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Choose a new password" description="Make it strong and unique to this account.">
      {!token && (
        <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          This reset link is missing its token. Request a new one.
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Field label="New password" error={errors.newPassword?.message}>
          <Input {...register('newPassword')} type="password" autoComplete="new-password" placeholder="••••••••" invalid={!!errors.newPassword} />
        </Field>
        <Field label="Confirm password" error={errors.confirmPassword?.message}>
          <Input {...register('confirmPassword')} type="password" autoComplete="new-password" placeholder="••••••••" invalid={!!errors.confirmPassword} />
        </Field>
        {errors.root && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{errors.root.message}</p>
        )}
        <Button type="submit" className="w-full" loading={isSubmitting || !token}>Update password</Button>
      </form>
    </AuthLayout>
  )
}
