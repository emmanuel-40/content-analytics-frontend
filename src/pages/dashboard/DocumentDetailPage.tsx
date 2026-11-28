import { Download, FileText, RotateCcw } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/AppShell'
import { ProgressBar, SentimentBadge, StatusBadge } from '@/components/shared/Status'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { EmptyState, PageLoader } from '@/components/ui/Feedback'
import { downloadAnalysisReport, useDocument, useRetryDocument, useDocumentStatus } from '@/hooks/useDocuments'
import { formatBytes, formatDate } from '@/lib/utils'

function parseTopics(raw?: string): string[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(String) : [raw]
  } catch {
    return [raw]
  }
}

export function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: document, isLoading } = useDocument(id)
  const { data: status } = useDocumentStatus(id, document?.status === 'PROCESSING' || document?.status === 'UPLOADED')
  const retry = useRetryDocument()

  if (isLoading) return <PageLoader label="Loading document…" />
  if (!document) {
    return (
      <EmptyState
        icon={<FileText className="h-5 w-5" />}
        title="Document not found"
        description="It may have been deleted or belongs to another account."
        action={<Link to="/app/documents"><Button>Back to documents</Button></Link>}
      />
    )
  }

  const topics = parseTopics(document.keyTopics)
  const progress = status?.processingProgress ?? document.processingProgress ?? 0

  return (
    <>
      <PageHeader
        title={document.fileName}
        description={`Uploaded ${formatDate(document.createdAt)}${document.fileSize ? ` · ${formatBytes(document.fileSize)}` : ''}`}
        action={
          <div className="flex gap-2">
            {document.status === 'FAILED' && (
              <Button
                variant="outline"
                onClick={() =>
                  retry.mutate(document.id, {
                    onSuccess: () => toast.success('Queued for re-processing'),
                    onError: () => toast.error('Could not retry'),
                  })
                }
              >
                <RotateCcw className="h-4 w-4" /> Retry
              </Button>
            )}
            <Button
              disabled={document.status !== 'COMPLETED'}
              title={document.status === 'COMPLETED' ? undefined : 'Report available after analysis completes'}
              onClick={() =>
                downloadAnalysisReport(document.id, document.fileName)
                  .then(() => toast.success('Report downloaded'))
                  .catch(() => toast.error('Report download failed'))
              }
            >
              <Download className="h-4 w-4" /> Download report
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Analysis</CardTitle>
              <div className="flex items-center gap-2">
                <StatusBadge status={document.status} />
                {document.sentiment && <SentimentBadge sentiment={document.sentiment} />}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {(document.status === 'PROCESSING' || document.status === 'UPLOADED') && (
                <div>
                  <div className="mb-1.5 flex justify-between text-xs text-zinc-500">
                    <span>{status?.processingError ?? 'Analysing document…'}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <ProgressBar value={progress} />
                </div>
              )}
              {document.status === 'FAILED' && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                  {document.processingError ?? 'Processing failed.'}
                </p>
              )}
              {document.summary ? (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Summary</h4>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-zinc-300">{document.summary}</p>
                </div>
              ) : (
                <p className="text-sm text-zinc-500">Analysis results will appear here when processing completes.</p>
              )}
              {topics.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Key topics</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {topics.map((topic, index) => (
                      <span key={`${topic}-${index}`} className="chip border-signal-500/25 bg-signal-400/5 text-signal-300">{topic}</span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              {[
                ['Status', document.status],
                ['Pages', document.pageCount ?? 'N/A'],
                ['Words', document.wordCount ?? 'N/A'],
                ['Characters', document.characterCount ?? 'N/A'],
                ['Confidence', document.confidenceScore != null ? `${Math.round(document.confidenceScore)}%` : 'N/A'],
                ['MIME type', document.mimeType ?? 'N/A'],
                ['Completed', document.processingCompletedAt ? formatDate(document.processingCompletedAt) : 'N/A'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-zinc-500">{label}</dt>
                  <dd className="truncate text-right font-medium text-zinc-200">{value}</dd>
                </div>
              ))}
            </dl>
            {document.description && (
              <p className="mt-5 border-t border-ink-800 pt-4 text-sm leading-relaxed text-zinc-400">{document.description}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
