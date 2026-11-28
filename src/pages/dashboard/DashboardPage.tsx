import { useQueryClient } from '@tanstack/react-query'
import { ArrowUpRight, CheckCircle2, Clock3, FileStack, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { UploadCard } from '@/components/documents/UploadCard'
import { PageHeader } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { ProgressBar, StatusBadge } from '@/components/shared/Status'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { EmptyState, Skeleton } from '@/components/ui/Feedback'
import { useAccessToken } from '@/hooks/useAccessToken'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentList, useDocumentStats } from '@/hooks/useDocuments'
import { useDocumentProgress } from '@/hooks/useDocumentProgress'
import { queryKeys } from '@/lib/queryClient'
import { formatDate, formatNumber } from '@/lib/utils'

export function DashboardPage() {
  const { user, credits } = useAuth()
  const queryClient = useQueryClient()
  const token = useAccessToken()

  useDocumentProgress(user?.id, token, (message) => {
    if (message.messageType === 'PROCESSING_COMPLETED') {
      toast.success(`${message.fileName ?? 'Document'} is ready`)
    } else if (message.messageType === 'PROCESSING_FAILED') {
      toast.error(`Processing failed for ${message.fileName ?? 'a document'}`)
    }
    void queryClient.invalidateQueries({ queryKey: queryKeys.documents })
    void queryClient.invalidateQueries({ queryKey: queryKeys.subscription })
  })

  const { data: stats, isLoading: statsLoading } = useDocumentStats()
  const { data: documents, isLoading: documentsLoading } = useDocumentList(0, 5)

  const cards = [
    { label: 'Documents', value: stats?.totalDocuments, icon: FileStack },
    { label: 'Completed', value: stats?.completedDocuments, icon: CheckCircle2 },
    { label: 'In progress', value: stats?.processingDocuments, icon: Clock3 },
    { label: 'Credits left', value: credits, icon: Sparkles },
  ]

  return (
    <>
      <PageHeader
        title={`Welcome back${user?.firstName ? `, ${user.firstName}` : ''}`}
        description="Here's what's happening with your documents."
        action={
          <Link to="/app/documents">
            <Button variant="outline">Open library <ArrowUpRight className="h-4 w-4" /></Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="surface-hover p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</span>
              <Icon className="h-4 w-4 text-signal-400" />
            </div>
            {statsLoading && value === undefined ? (
              <Skeleton className="mt-4 h-8 w-20" />
            ) : (
              <p className="mt-3 font-display text-3xl font-bold text-zinc-50">
                {value === undefined ? 'N/A' : formatNumber(value)}
              </p>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Recent documents</CardTitle>
              <Link to="/app/documents" className="text-xs text-signal-400 hover:text-signal-300">View all →</Link>
            </CardHeader>
            <CardContent className="p-0">
              {documentsLoading ? (
                <div className="space-y-3 p-5">
                  {[1, 2, 3].map((key) => <Skeleton key={key} className="h-12 w-full" />)}
                </div>
              ) : !documents?.content.length ? (
                <div className="p-5">
                  <EmptyState
                    icon={<FileStack className="h-5 w-5" />}
                    title="No documents yet"
                    description="Upload your first file to see analysis results here."
                  />
                </div>
              ) : (
                <ul className="divide-y divide-ink-800">
                  {documents.content.map((document) => (
                    <li key={document.id}>
                      <Link
                        to={`/app/documents/${document.id}`}
                        className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-ink-800/60"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-zinc-200">{document.fileName}</p>
                          <p className="mt-0.5 text-xs text-zinc-500">{formatDate(document.createdAt)}</p>
                          {document.status === 'PROCESSING' && (
                            <ProgressBar className="mt-2" value={document.processingProgress ?? 0} />
                          )}
                        </div>
                        <StatusBadge status={document.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <UploadCard compact />
          <p className="mt-4 text-center text-xs text-zinc-600">
            Progress updates arrive live over WebSocket, with polling as a fallback.
          </p>
        </div>
      </div>
    </>
  )
}
