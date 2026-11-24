import { FileStack, Gauge, LockKeyhole, Radio, Sparkles, Wallet } from 'lucide-react'
import { Card } from '@/components/ui/Card'

const features = [
  {
    icon: FileStack,
    title: 'Upload anything',
    description: 'PDFs and Office documents go straight into a private, organised library.',
  },
  {
    icon: Sparkles,
    title: 'Structured AI analysis',
    description: 'Summaries, key topics and sentiment — consistent output you can actually use.',
  },
  {
    icon: Radio,
    title: 'Real-time progress',
    description: 'Watch each analysis job move from queued to complete over live WebSocket updates.',
  },
  {
    icon: Wallet,
    title: 'Honest credits',
    description: 'A clear monthly allowance, transparent top-ups and an append-only ledger.',
  },
  {
    icon: Gauge,
    title: 'Usage you can see',
    description: 'Track health metrics and analyse counts so you always know where you stand.',
  },
  {
    icon: LockKeyhole,
    title: 'Secure by design',
    description: 'HttpOnly JWT sessions, CSRF protection, verified webhooks and row-locked billing.',
  },
]

function SparkleIcon({ className }: { className?: string }) {
  return <BarChart3 className={className} />
}

export function Features() {
  return (
    <section id="features" className="container-page scroll-mt-20 py-20 sm:py-28">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-signal-400">Why Content Analytics</p>
        <h2 className="mt-3 text-3xl font-bold text-zinc-50 sm:text-4xl">Everything you need to read less and know more.</h2>
        <p className="mt-4 text-zinc-400">A focused toolkit for people whose work lives in documents.</p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="surface-hover p-6">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-signal-500/25 bg-signal-400/10 text-signal-400">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">{description}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
