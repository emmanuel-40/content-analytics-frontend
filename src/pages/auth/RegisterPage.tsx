import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'
import { useAuth } from '@/hooks/useAuth'
import { ApiError } from '@/lib/api'
import { registerSchema, type RegisterForm } from '@/lib/schemas'

export function RegisterPage() {
  const { register: registerUser } = useAuth()
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (values: RegisterForm) => {
    try {
      await registerUser({
        username: values.username,
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      })
      setDone(true)
      toast.success('Account created — check your inbox')
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Unable to create account'
      setError('root', { message })
    }
  }

  if (done) {
    return (
      <AuthLayout title="Check your email" description="One more step before you can sign in.">
        <div className="rounded-2xl border border-signal-500/25 bg-signal-400/5 p-5 text-sm leading-relaxed text-zinc-300">
          We sent a verification link to your email address. Open it, then sign in to start
          analysing documents.
        </div>
        <Link to="/login" className="mt-6 block">
          <Button className="w-full">Go to sign in <ArrowRight className="h-4 w-4" /></Button>
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Create your account" description="Start with free monthly credits. No card needed.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" error={errors.firstName?.message}>
            <Input {...register('firstName')} autoComplete="given-name" placeholder="Ada" />
          </Field>
          <Field label="Last name" error={errors.lastName?.message}>
            <Input {...register('lastName')} autoComplete="family-name" placeholder="Lovelace" />
          </Field>
        </div>

        <Field label="Username" error={errors.username?.message} hint="Letters, numbers, _ and - only">
          <Input {...register('username')} autoComplete="username" placeholder="ada-lovelace" invalid={!!errors.username} />
        </Field>

        <Field label="Email" error={errors.email?.message}>
          <Input {...register('email')} type="email" autoComplete="email" placeholder="you@example.com" invalid={!!errors.email} />
        </Field>

        <Field label="Password" error={errors.password?.message} hint="Upper, lower, number and @$!%*?&">
          <Input {...register('password')} type="password" autoComplete="new-password" placeholder="••••••••" invalid={!!errors.password} />
        </Field>

        <Field label="Confirm password" error={errors.confirmPassword?.message}>
          <Input {...register('confirmPassword')} type="password" autoComplete="new-password" placeholder="••••••••" invalid={!!errors.confirmPassword} />
        </Field>

        {errors.root && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {errors.root.message}
          </p>
        )}

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-signal-400 hover:text-signal-300">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
