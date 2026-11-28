import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-8 pt-20 sm:pt-28">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-signal-500/10 blur-[130px]" />

      <div className="container-page relative text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-signal-500/30 bg-signal-400/10 px-3.5 py-1.5 text-xs font-medium text-signal-300">
          <Sparkles className="h-3.5 w-3.5" />
          AI document intelligence, ready when you are
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-[1.08] text-zinc-50 sm:text-6xl lg:text-7xl">
          Understand every<br />
          <span className="text-gradient">document you upload.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          Drop in a PDF or Office file and get a structured summary, key topics and sentiment,
          with credit-aware usage and live job progress built right in.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto">
              Start analysing free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">See how it works</Button>
          </a>
        </div>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500">
          {['No card required', 'Private by default', 'Live analysis progress'].map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-signal-400" /> {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
