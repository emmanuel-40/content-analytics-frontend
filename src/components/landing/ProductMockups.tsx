import { BarChart3, FileText, Sparkles, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'

function MockupFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-ink-600 bg-ink-900 shadow-2xl shadow-black/60">
      <div className="flex items-center gap-1.5 border-b border-ink-700 bg-ink-850 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-500/70" />
        <span className="h-2 w-2 rounded-full bg-signal-500/70" />
        <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
        <span className="ml-3 text-[10px] font-medium tracking-wide text-zinc-500">{label}</span>
      </div>
      <div className="grid grid-cols-[110px_1fr] md:grid-cols-[160px_1fr]">
        <aside className="hidden border-r border-ink-700 bg-ink-950/60 p-3 md:block">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-signal-400 text-ink-950">
              <FileText className="h-3 w-3" />
            </div>
            <span className="text-[10px] font-semibold text-zinc-200">CA</span>
          </div>
          {['Overview', 'Documents', 'Analysis', 'Billing', 'Settings'].map((item, i) => (
            <div
              key={item}
              className={cn(
                'mb-1 rounded-md px-2 py-1.5 text-[10px]',
                i === 0 ? 'bg-signal-400/10 text-signal-300' : 'text-zinc-500',
              )}
            >
              {item}
            </div>
          ))}
        </aside>
        <div className="min-h-[230px] bg-ink-900 p-3 md:min-h-[280px] md:p-5">{children}</div>
      </div>
    </div>
  )
}

function Row({ wide, dim }: { wide?: boolean; dim?: boolean }) {
  return <div className={cn('h-1.5 rounded-full', dim ? 'bg-ink-700' : 'bg-ink-600', wide ? 'w-3/4' : 'w-1/2')} />
}

export function DashboardMockup() {
  return (
    <MockupFrame label="app.contentanalytics.io / overview">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-zinc-100 md:text-sm">Good afternoon, Alex</div>
          <div className="mt-1 text-[10px] text-zinc-500">Here is what your documents are saying.</div>
        </div>
        <div className="hidden rounded-lg border border-signal-500/30 bg-signal-400/10 px-2.5 py-1.5 text-[10px] font-semibold text-signal-300 sm:block">
          86 credits left
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {[
          { label: 'Documents', value: '128', icon: FileText },
          { label: 'Analysed', value: '94', icon: BarChart3 },
          { label: 'Insights', value: '312', icon: Sparkles },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-ink-700 bg-ink-850 p-2.5">
            <Icon className="mb-2 h-3.5 w-3.5 text-signal-400" />
            <div className="text-sm font-bold text-zinc-50 md:text-lg">{value}</div>
            <div className="text-[9px] text-zinc-500">{label}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg border border-ink-700 bg-ink-850 p-3">
          <div className="mb-3 text-[10px] font-semibold text-zinc-300">Analysis activity</div>
          <div className="flex h-16 items-end gap-1.5">
            {[35, 55, 42, 70, 50, 85, 62, 90, 72, 96, 80, 100].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm bg-signal-400/80" style={{ height: `${h}%`, opacity: 0.35 + h / 160 }} />
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-ink-700 bg-ink-850 p-3">
          <div className="mb-3 text-[10px] font-semibold text-zinc-300">Recent files</div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="mb-2 flex items-center gap-2">
              <div className="h-5 w-5 shrink-0 rounded bg-signal-400/10" />
              <div className="flex-1 space-y-1"><Row wide={i !== 1} /><Row dim /></div>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
          ))}
        </div>
      </div>
    </MockupFrame>
  )
}

export function AnalysisMockup() {
  return (
    <MockupFrame label="app.contentanalytics.io / analysis">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-zinc-100 md:text-sm">Quarterly strategy brief.pdf</div>
          <div className="mt-1 text-[10px] text-zinc-500">Analysed 2 minutes ago · 4,820 words</div>
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[9px] font-semibold text-emerald-300">
          COMPLETED
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.3fr_1fr]">
        <div className="rounded-lg border border-ink-700 bg-ink-850 p-3">
          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold text-signal-300">
            <Sparkles className="h-3 w-3" /> AI summary
          </div>
          <div className="space-y-1.5">
            <Row wide />
            <Row />
            <Row wide />
            <div className="w-2/3"><Row dim /></div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {['growth', 'retention', 'Q4', 'hiring'].map((tag) => (
              <span key={tag} className="rounded-full border border-ink-600 bg-ink-900 px-2 py-0.5 text-[9px] text-zinc-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-lg border border-ink-700 bg-ink-850 p-3">
            <div className="mb-2 text-[10px] font-semibold text-zinc-300">Sentiment</div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-700">
                <div className="h-full w-[76%] rounded-full bg-signal-400" />
              </div>
              <span className="text-[10px] font-bold text-signal-300">76%</span>
            </div>
          </div>
          <div className="rounded-lg border border-ink-700 bg-ink-850 p-3">
            <div className="mb-2 text-[10px] font-semibold text-zinc-300">Word frequency</div>
            <div className="space-y-1.5">
              {[88, 64, 46, 30].map((w, i) => (
                <div key={i} className="h-1.5 rounded-full bg-signal-400/70" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MockupFrame>
  )
}

export function BillingMockup() {
  return (
    <MockupFrame label="app.contentanalytics.io / billing">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold text-zinc-100 md:text-sm">Credits & billing</div>
          <div className="mt-1 text-[10px] text-zinc-500">Monthly allowance plus top-ups</div>
        </div>
        <Wallet className="h-4 w-4 text-signal-400" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { name: 'Starter', credits: '10', price: '$2.00' },
          { name: 'Pro', credits: '50', price: '$8.00', featured: true },
          { name: 'Scale', credits: '120', price: '$16.00' },
        ].map((pack) => (
          <div
            key={pack.name}
            className={cn(
              'rounded-lg border p-3',
              pack.featured ? 'border-signal-400/60 bg-signal-400/10' : 'border-ink-700 bg-ink-850',
            )}
          >
            <div className="text-[10px] font-semibold text-zinc-300">{pack.name}</div>
            <div className="mt-2 text-lg font-bold text-zinc-50">{pack.credits}</div>
            <div className="text-[9px] text-zinc-500">credits</div>
            <div className={cn('mt-2 rounded-md py-1 text-center text-[9px] font-semibold', pack.featured ? 'bg-signal-400 text-ink-950' : 'bg-ink-700 text-zinc-300')}>
              {pack.price}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg border border-ink-700 bg-ink-850 p-3">
        <div className="mb-2 flex items-center justify-between text-[10px]">
          <span className="font-semibold text-zinc-300">Recent transactions</span>
          <span className="text-zinc-500">This month</span>
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 border-t border-ink-700 py-2 text-[9px]">
            <div className="w-16"><Row dim /></div>
            <div className="flex-1"><Row wide /></div>
            <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 font-semibold text-emerald-300">SUCCESS</span>
          </div>
        ))}
      </div>
    </MockupFrame>
  )
}
