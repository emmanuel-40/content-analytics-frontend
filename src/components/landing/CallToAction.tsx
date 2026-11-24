import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function CallToAction() {
  return (
    <section className="container-page pb-24 pt-4">
      <div className="relative overflow-hidden rounded-3xl border border-signal-500/25 bg-ink-900 px-6 py-14 text-center shadow-glow sm:px-12">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-signal-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-signal-500/10 blur-3xl" />
        <div className="relative">
          <h2 className="text-3xl font-bold text-zinc-50 sm:text-4xl">Your documents already have answers.</h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Create a free account, upload your first file and see the difference in minutes.
          </p>
          <Link to="/register" className="mt-8 inline-block">
            <Button size="lg">Start free <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
