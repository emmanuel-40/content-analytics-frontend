import { FileChartColumnIncreasing } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-signal-400 text-ink-950 shadow-lg shadow-signal-500/20">
        <FileChartColumnIncreasing className="h-5 w-5" strokeWidth={2.4} />
      </span>
      {!compact && (
        <span className="font-display text-[17px] font-bold tracking-tight text-zinc-50">
          Content<span className="text-signal-400">Analytics</span>
        </span>
      )}
    </div>
  )
}
