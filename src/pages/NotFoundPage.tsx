import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/shared/Logo'

export function NotFoundPage() {
  return (
    <div className="grid-bg flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <Logo />
      <p className="mt-10 font-display text-7xl font-bold text-signal-400">404</p>
      <h1 className="mt-3 text-xl font-semibold text-zinc-100">This page has no insight to offer</h1>
      <p className="mt-2 text-sm text-zinc-500">The link may be old, or the page may have moved.</p>
      <Link to="/" className="mt-7"><Button>Back to home</Button></Link>
    </div>
  )
}
