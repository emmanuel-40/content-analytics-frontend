import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'
import { apiClient } from '@/lib/api'
import { forgotPasswordSchema, type ForgotPasswordForm } from '@/lib/schemas'

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = async (values: ForgotPasswordForm) => {
    await apiClient.post('/api/auth/forgot-password', values, { auth: false })
    setSent(true)
  }

  return (
    <AuthLayout
      title="Reset your password"
      description="We'll email you a link if an account exists for that address."
    >
      {sent ? (
        <div className="rounded-2xl border border-signal-500/25 bg-signal-400/5 p-5 text-sm leading-relaxed text-zinc-300">
          If an account exists with that email, a password reset link is on its way.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Field label="Email" error={errors.email?.message}>
            <Input {...register('email')} type="email" autoComplete="email" placeholder="you@example.com" invalid={!!errors.email} />
          </Field>
          <Button type="submit" className="w-full" loading={isSubmitting}>Send reset link</Button>
        </form>
      )}
      <Link to="/login" className="mt-6 block text-center text-sm text-zinc-500 hover:text-signal-300">
        Back to sign in
      </Link>
    </AuthLayout>
  )
}
