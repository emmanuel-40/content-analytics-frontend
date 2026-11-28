import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { GoogleSignInButton } from '@/components/shared/GoogleSignInButton'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'
import { ApiError, apiClient } from '@/lib/api'
import { loginSchema, type LoginForm } from '@/lib/schemas'
import { useAuth } from '@/hooks/useAuth'
import { queryKeys } from '@/lib/queryClient'
import { useQuery } from '@tanstack/react-query'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const { data: providers } = useQuery({
    queryKey: queryKeys.providers,
    queryFn: () => apiClient.get<{ google: boolean }>('/api/auth/providers', { auth: false }),
    staleTime: Infinity,
  })
  // Show the button while the lookup is loading or if the backend is briefly
  // restarting. Only an explicit `false` from the server hides it.
  const googleEnabled = providers?.google ?? true

  const onSubmit = async (values: LoginForm) => {
    try {
      await login(values)
      toast.success('Welcome back')
      navigate('/app')
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Unable to sign in'
      setError('root', { message })
    }
  }

  return (
    <AuthLayout title="Welcome back" description="Sign in to continue analysing your documents.">
      {googleEnabled && (
        <>
          <GoogleSignInButton />
          <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-widest text-zinc-600">
            <span className="h-px flex-1 bg-ink-700" /> or use your account <span className="h-px flex-1 bg-ink-700" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
        <Field label="Username" error={errors.username?.message}>
          <Input {...register('username')} autoComplete="username" placeholder="your-username" invalid={!!errors.username} />
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <div className="relative">
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              className="pr-11"
              invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-signal-300"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        {errors.root && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {errors.root.message}
          </p>
        )}

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-zinc-500 hover:text-signal-300">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        New here?{' '}
        <Link to="/register" className="font-semibold text-signal-400 hover:text-signal-300">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}
