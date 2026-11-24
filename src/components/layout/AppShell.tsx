import {
  Activity,
  CreditCard,
  FileStack,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  X,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { cn, initials } from '@/lib/utils'

const navItems = [
  { to: '/app', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/app/documents', label: 'Documents', icon: FileStack },
  { to: '/app/health', label: 'Health metrics', icon: Activity },
  { to: '/app/billing', label: 'Credits & billing', icon: CreditCard },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { user, logout, credits } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-ink-950">
      {open && <button aria-label="Close menu" className="fixed inset-0 z-30 bg-black/70 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-ink-800 bg-ink-900 transition-transform lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-ink-800 px-5">
          <Link to="/"><Logo /></Link>
          <button onClick={() => setOpen(false)} className="text-zinc-500 lg:hidden" aria-label="Close sidebar">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-signal-400/10 text-signal-300'
                    : 'text-zinc-400 hover:bg-ink-800 hover:text-zinc-100',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-800 p-4">
          <div className="mb-3 rounded-xl border border-signal-500/25 bg-signal-400/5 p-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-signal-300">
              <Sparkles className="h-3.5 w-3.5" /> Credits
            </div>
            <div className="mt-1 text-xl font-bold text-zinc-50">{credits ?? '—'}</div>
            <Link to="/app/billing" className="mt-1 block text-xs text-zinc-500 hover:text-signal-300">Top up →</Link>
          </div>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-ink-800 hover:text-red-300">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-ink-800 bg-ink-950/85 px-5 backdrop-blur-xl">
          <button onClick={() => setOpen(true)} className="text-zinc-400 lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <div className="text-sm font-medium text-zinc-200">{user.displayName ?? user.username}</div>
                <div className="text-xs text-zinc-500">{user.email}</div>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-signal-500/30 bg-signal-400/10 text-xs font-bold text-signal-300">
                {initials(user.displayName ?? user.username)}
              </div>
            </div>
          )}
        </header>
        <main className="container-page py-8">{children}</main>
      </div>
    </div>
  )
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-zinc-500">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function EmptyAction({ to, children }: { to: string; children: ReactNode }) {
  return <Link to={to}><Button>{children}</Button></Link>
}
