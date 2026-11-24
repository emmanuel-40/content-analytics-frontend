import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'
import { ApiError, apiClient, apiUrl } from '@/lib/api'
import { loginSchema, type LoginForm } from '@/lib/schemas'
import { useAuth } from '@/hooks/useAuth'
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
    queryKey: ['providers'],
    queryFn: () => apiClient.get<{ google: boolean }>('/api/auth/providers', { auth: false }),
    staleTime: Infinity,
  })

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
      {providers?.google && (
        <>
          <a href={apiUrl('/oauth2/authorization/google')} className="block">
            <Button variant="outline" className="w-full" type="button">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
                <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
              </svg>
              Continue with Google
            </Button>
          </a>
          <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-widest text-zinc-600">
            <span className="h-px flex-1 bg-ink-700" /> or use your account <span className="h-px flex-1 bg-ink-700" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
