import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { PageLoader } from '@/components/ui/Feedback'
import { useAuth } from '@/hooks/useAuth'

const REASONS: Record<string, string> = {
  access_denied: 'You cancelled the Google sign-in.',
  link_conflict: 'That email is already linked to a different Google account.',
  email_unverified: 'Your Google email must be verified before you can continue.',
  state_mismatch: 'The sign-in session expired. Please try again.',
  client_not_configured: 'Google sign-in is not configured on this deployment.',
  missing_user: 'We could not finish creating your account. Please try again.',
  error: 'Google sign-in could not be completed.',
}

export function AuthCallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { refresh } = useAuth()
  const status = params.get('status')
  const reason = params.get('reason') ?? 'error'
  const [error, setError] = useState<string | null>(null)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    if (status === 'success') {
      refresh()
        .then(() => navigate('/app', { replace: true }))
        .catch(() => setError('Your session could not be started. Please sign in again.'))
    } else {
      setError(REASONS[reason] ?? REASONS.error)
    }
  }, [status, reason, refresh, navigate])

  return (
    <AuthLayout title="Google sign-in" description="Finishing your session.">
      {!error ? (
        <PageLoader label="Signing you in…" />
      ) : (
        <>
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
          <Link to="/login" className="mt-6 block"><Button className="w-full">Back to sign in</Button></Link>
        </>
      )}
    </AuthLayout>
  )
}
