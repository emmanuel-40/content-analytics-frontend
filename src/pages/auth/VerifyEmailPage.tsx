import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { PageLoader } from '@/components/ui/Feedback'
import { ApiError, apiClient, qs } from '@/lib/api'

export function VerifyEmailPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    if (!token) {
      setState('error')
      setMessage('This verification link is missing its token.')
      return
    }
    apiClient
      .get(`/api/auth/verify-email${qs({ token })}`, { auth: false })
      .then(() => setState('success'))
      .catch((error: unknown) => {
        setState('error')
        setMessage(error instanceof ApiError ? error.message : 'Unable to verify your email')
      })
  }, [token])

  return (
    <AuthLayout title="Email verification" description="Confirming your address, one moment.">
      {state === 'loading' && <PageLoader label="Verifying your email…" />}
      {state === 'success' && (
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5 text-sm leading-relaxed text-emerald-200">
          Your email is verified. You can now sign in.
        </div>
      )}
      {state === 'error' && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{message}</p>
      )}
      <Link to="/login" className="mt-6 block">
        <Button className="w-full">{state === 'success' ? 'Sign in' : 'Back to sign in'}</Button>
      </Link>
    </AuthLayout>
  )
}
