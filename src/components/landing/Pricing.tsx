import { Check, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

const packs = [
  {
    name: 'Starter',
    credits: 10,
    price: '$2.00',
    description: 'For a first look at document intelligence.',
    features: ['10 analysis credits', 'Unlimited uploads', 'Live job progress', 'Full analysis history'],
  },
  {
    name: 'Pro',
    credits: 50,
    price: '$8.00',
    featured: true,
    description: 'For regular research and writing work.',
    features: ['50 analysis credits', 'Priority AI analysis', 'Credit usage ledger', 'Profile & avatar uploads'],
  },
  {
    name: 'Scale',
    credits: 120,
    price: '$16.00',
    description: 'For teams who live in documents.',
    features: ['120 analysis credits', 'Best value per credit', 'Full audit trail', 'All platform features'],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="container-page scroll-mt-20 py-20 sm:py-28">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-signal-400">Simple pricing</p>
        <h2 className="mt-3 text-3xl font-bold text-zinc-50 sm:text-4xl">Pay for insight, not for seats.</h2>
        <p className="mx-auto mt-4 max-w-xl text-zinc-400">
          Every new account starts with a free monthly allowance. Top up only when you need more.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
        {packs.map((pack) => (
          <Card
            key={pack.name}
            className={cn(
              'surface-hover relative flex flex-col p-6',
              pack.featured && 'border-signal-400/60 shadow-glow',
            )}
          >
            {pack.featured && (
              <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-signal-400 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ink-950">
                <Sparkles className="h-3 w-3" /> Most popular
              </span>
            )}
            <h3 className="text-lg font-semibold text-zinc-100">{pack.name}</h3>
            <p className="mt-1 text-sm text-zinc-500">{pack.description}</p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold text-zinc-50">{pack.price}</span>
              <span className="text-sm text-zinc-500">one-off</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-signal-400">{pack.credits} analysis credits</p>
            <ul className="mt-6 flex-1 space-y-3">
              {pack.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-zinc-400">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-signal-400" /> {feature}
                </li>
              ))}
            </ul>
            <Link to="/register" className="mt-7 block">
              <Button variant={pack.featured ? 'primary' : 'outline'} className="w-full">Get started</Button>
            </Link>
          </Card>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-zinc-600">
        Payments are verified server-side through Paystack before any credit is added.
      </p>
    </section>
  )
}
