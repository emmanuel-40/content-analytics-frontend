import { Link } from 'react-router-dom'
import { Logo } from '@/components/shared/Logo'

export function LandingFooter() {
  return (
    <footer className="border-t border-ink-800 bg-ink-950">
      <div className="container-page py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
              Document intelligence for people who would rather understand than scroll.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-200">Product</h4>
            <ul className="mt-4 space-y-2 text-sm text-zinc-500">
              <li><a href="#features" className="hover:text-signal-300">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-signal-300">How it works</a></li>
              <li><a href="#pricing" className="hover:text-signal-300">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-200">Account</h4>
            <ul className="mt-4 space-y-2 text-sm text-zinc-500">
              <li><Link to="/login" className="hover:text-signal-300">Sign in</Link></li>
              <li><Link to="/register" className="hover:text-signal-300">Create account</Link></li>
              <li><Link to="/forgot-password" className="hover:text-signal-300">Reset password</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-200">Built with</h4>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              Spring Boot 4 · PostgreSQL · Redis · React · TanStack Query
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-ink-800 pt-6 text-xs text-zinc-600 sm:flex-row">
          <span>© {new Date().getFullYear()} Content Analytics. All rights reserved.</span>
          <span>Clear insight, one document at a time.</span>
        </div>
      </div>
    </footer>
  )
}
