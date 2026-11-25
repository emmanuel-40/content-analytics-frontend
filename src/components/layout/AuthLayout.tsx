import { ArrowLeft, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/shared/Logo'

export function AuthLayout({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="relative flex min-h-dvh items-start justify-center overflow-x-clip bg-ink-950 px-5 py-6 sm:px-6 sm:py-8">
      {/* The grid texture must not mask the form. Keep it on its own layer. */}
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-signal-500/10 blur-[100px]"
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-md pb-6">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-2 text-xs text-zinc-400 transition hover:text-signal-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </Link>

        <div className="surface rounded-3xl border border-signal-500/30 p-5 shadow-glow sm:p-6">
          <div className="mb-4 flex flex-col items-center text-center">
            <Logo />
            <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-signal-400">
              <Sparkles className="h-3 w-3" /> Document intelligence
            </div>
            <h1 className="mt-2 text-xl font-bold text-zinc-50 sm:text-2xl">{title}</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
