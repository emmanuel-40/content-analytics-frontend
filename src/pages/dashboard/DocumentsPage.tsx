import { Download, FileStack, RotateCcw, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { UploadCard } from '@/components/documents/UploadCard'
import { PageHeader } from '@/components/layout/AppShell'
import { ProgressBar, SentimentBadge, StatusBadge } from '@/components/shared/Status'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState, Skeleton } from '@/components/ui/Feedback'
import { Input, Select } from '@/components/ui/Field'
import { useAccessToken } from '@/hooks/useAccessToken'
import { useAuth } from '@/hooks/useAuth'
import {
  downloadDocument,
  useDeleteDocument,
  useDocumentSearch,
  useRetryDocument,
} from '@/hooks/useDocuments'
import { useDocumentProgress } from '@/hooks/useDocumentProgress'
import { queryKeys } from '@/lib/queryClient'
import { formatBytes, formatDate } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import type { DocumentStatus } from '@/types/api'

export function DocumentsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const { user } = useAuth()
  const token = useAccessToken()
  const queryClient = useQueryClient()

  useDocumentProgress(user?.id, token, () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.documents })
  })

  const filters = useMemo(
    () => ({ fileName: query || undefined, status: status || undefined, pageNumber: page, pageSize: 12, sortBy: 'createdAt', sortDirection: 'DESC' as const }),
    [query, status, page],
  )
  const { data, isLoading, isFetching } = useDocumentSearch(filters)
  const deleteDocument = useDeleteDocument()
  const retry = useRetryDocument()

  return (
    <>
      <PageHeader
        title="Documents"
        description="Upload, track and revisit every analysis."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="mb-4 flex flex-col gap-3 p-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
              <Input
                value={query}
                onChange={(event) => { setQuery(event.target.value); setPage(0) }}
                placeholder="Search by filename…"
                className="pl-9"
              />
            </div>
            <Select
              value={status}
              onChange={(event) => { setStatus(event.target.value); setPage(0) }}
              className="sm:w-44"
            >
              <option value="">All statuses</option>
              {(['UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED'] as DocumentStatus[]).map((item) => (
                <option key={item} value={item}>{item.toLowerCase()}</option>
              ))}
            </Select>
          </Card>

          <Card className="overflow-hidden">
            {isLoading ? (
              <div className="space-y-3 p-5">
                {[1, 2, 3, 4].map((key) => <Skeleton key={key} className="h-14 w-full" />)}
              </div>
            ) : !data?.content.length ? (
              <div className="p-5">
                <EmptyState
                  icon={<FileStack className="h-5 w-5" />}
                  title="Nothing here yet"
                  description={query || status ? 'Try a different search.' : 'Upload a document to get started.'}
                />
              </div>
            ) : (
              <>
                <div className={`overflow-x-auto ${isFetching ? 'opacity-60' : ''}`}>
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-ink-800 text-[11px] uppercase tracking-wider text-zinc-500">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Document</th>
                        <th className="px-3 py-3 font-semibold">Status</th>
                        <th className="hidden px-3 py-3 font-semibold md:table-cell">Words</th>
                        <th className="hidden px-3 py-3 font-semibold lg:table-cell">Created</th>
                        <th className="px-5 py-3 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-800">
                      {data.content.map((document) => (
                        <tr key={document.id} className="transition hover:bg-ink-900/60">
                          <td className="px-5 py-3.5">
                            <Link to={`/app/documents/${document.id}`} className="font-medium text-zinc-200 hover:text-signal-300">
                              {document.fileName}
                            </Link>
                            <p className="mt-0.5 text-xs text-zinc-600">
                              {document.fileSize ? formatBytes(document.fileSize) : '—'}
                              {document.sentiment && <> · <SentimentBadge sentiment={document.sentiment} /></>}
                            </p>
                            {document.status === 'PROCESSING' && (
                              <ProgressBar className="mt-2 max-w-52" value={document.processingProgress ?? 0} />
                            )}
                          </td>
                          <td className="px-3 py-3.5"><StatusBadge status={document.status} /></td>
                          <td className="hidden px-3 py-3.5 text-zinc-400 md:table-cell">{document.wordCount ?? '—'}</td>
                          <td className="hidden px-3 py-3.5 text-xs text-zinc-500 lg:table-cell">{formatDate(document.createdAt)}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex justify-end gap-1">
                              {document.status === 'FAILED' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  aria-label="Retry processing"
                                  onClick={() =>
                                    retry.mutate(document.id, {
                                      onSuccess: () => toast.success('Queued for re-processing'),
                                      onError: () => toast.error('Could not retry this document'),
                                    })
                                  }
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Download document"
                                onClick={() =>
                                  downloadDocument(document.id, document.fileName).catch(() =>
                                    toast.error('Download failed'),
                                  )
                                }
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Delete document"
                                onClick={() => {
                                  if (!window.confirm(`Delete ${document.fileName}?`)) return
                                  deleteDocument.mutate(document.id, {
                                    onSuccess: () => toast.success('Document deleted'),
                                    onError: () => toast.error('Could not delete this document'),
                                  })
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-400" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {data.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-ink-800 px-5 py-3 text-xs text-zinc-500">
                    <span>Page {data.pageNumber + 1} of {data.totalPages}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled={!data.hasPrevious} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                      <Button variant="outline" size="sm" disabled={!data.hasNext} onClick={() => setPage((p) => p + 1)}>Next</Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>

        <div>
          <UploadCard />
        </div>
      </div>
    </>
  )
}
