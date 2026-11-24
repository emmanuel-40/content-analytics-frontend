import { Badge } from '@/components/ui/Feedback'
import type { DocumentStatus } from '@/types/api'
import { cn } from '@/lib/utils'

export function StatusBadge({ status }: { status: DocumentStatus }) {
  const tone =
    status === 'COMPLETED' ? 'success' : status === 'FAILED' ? 'danger' : status === 'PROCESSING' ? 'info' : 'warning'
  return <Badge tone={tone}>{status.toLowerCase()}</Badge>
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-ink-700', className)}>
      <div
        className="h-full rounded-full bg-signal-400 transition-all duration-500"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

export function SentimentBadge({ sentiment }: { sentiment?: string }) {
  if (!sentiment) return null
  const tone =
    sentiment === 'POSITIVE' ? 'success' : sentiment === 'NEGATIVE' ? 'danger' : 'neutral'
  return <Badge tone={tone}>{sentiment.toLowerCase()}</Badge>
}
