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
    <div className="grid-bg relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-5 py-12">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-signal-500/10 blur-[100px]" />
      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-signal-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </Link>

        <div className="surface rounded-3xl p-7 shadow-glow sm:p-9">
          <div className="mb-7 flex flex-col items-center text-center">
            <Logo />
            <div className="mt-6 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-signal-400">
              <Sparkles className="h-3 w-3" /> Document intelligence
            </div>
            <h1 className="mt-3 text-2xl font-bold text-zinc-50">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
