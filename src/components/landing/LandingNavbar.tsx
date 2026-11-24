import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
]

export function LandingNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-ink-800/80 bg-ink-950/85 backdrop-blur-xl">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link to="/" aria-label="Content Analytics home"><Logo /></Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-zinc-400 transition hover:text-signal-300">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/register"><Button size="sm">Get started free</Button></Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-700 text-zinc-300 md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      <div className={cn('border-t border-ink-800 bg-ink-950 px-5 py-4 md:hidden', open ? 'block' : 'hidden')}>
        <div className="flex flex-col gap-3">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="py-1 text-sm text-zinc-300">
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex gap-2">
            <Link to="/login" className="flex-1"><Button variant="outline" className="w-full">Sign in</Button></Link>
            <Link to="/register" className="flex-1"><Button className="w-full">Get started</Button></Link>
          </div>
        </div>
      </div>
    </header>
  )
}
