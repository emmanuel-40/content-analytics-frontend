import { ArrowUpRight, FileUp, ScanSearch, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: FileUp,
    number: '01',
    title: 'Upload a document',
    description: 'Choose a PDF or Office file. It lands in your library as UPLOADED and is queued instantly.',
  },
  {
    icon: ScanSearch,
    number: '02',
    title: 'We do the heavy lifting',
    description: 'A worker extracts the text, guards your credit balance and runs the analysis safely.',
  },
  {
    icon: Sparkles,
    number: '03',
    title: 'Read the insight',
    description: 'Get a summary, topics and sentiment with live progress, then download the analysis report.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-y border-ink-800 bg-ink-900/50 py-20 sm:py-28">
      <div className="container-page">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-signal-400">How it works</p>
          <h2 className="mt-3 text-3xl font-bold text-zinc-50 sm:text-4xl">From file to insight in three steps.</h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map(({ icon: Icon, number, title, description }, i) => (
            <div key={number} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute left-12 top-6 hidden h-px w-[calc(100%-2rem)] bg-gradient-to-r from-signal-500/40 to-transparent md:block" />
              )}
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-signal-500/30 bg-ink-950 text-signal-400">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-5 text-xs font-bold tracking-widest text-signal-500">{number}</div>
              <h3 className="mt-1 text-lg font-semibold text-zinc-100">{title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <a href="#pricing" className="inline-flex items-center gap-1 text-sm font-semibold text-signal-300 hover:text-signal-200">
            See credit pricing <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
