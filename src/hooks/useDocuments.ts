import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient, apiUrl, getAccessToken, newIdempotencyKey, qs } from '@/lib/api'
import { queryKeys } from '@/lib/queryClient'
import type {
  ApiResponse,
  DocumentListItem,
  DocumentResponse,
  DocumentSearchFilter,
  DocumentStats,
  DocumentStatusDto,
  Paged,
} from '@/types/api'

export function useDocumentList(page = 0, size = 12, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.documents, 'list', page, size],
    queryFn: () => apiClient.get<Paged<DocumentListItem>>(`/api/documents${qs({ page, size })}`),
    enabled,
  })
}

export function useDocumentSearch(filter: DocumentSearchFilter, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.documents, 'search', filter],
    queryFn: () => apiClient.post<Paged<DocumentListItem>>('/api/documents/search', filter),
    enabled,
  })
}

export function useDocumentStats(enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.documents, 'stats'],
    queryFn: () => apiClient.get<DocumentStats>('/api/documents/stats/overview'),
    enabled,
  })
}

export function useDocument(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.document(id ?? 'none'),
    queryFn: () => apiClient.get<DocumentResponse>(`/api/documents/${id}`),
    enabled: enabled && Boolean(id),
  })
}

/** Polls only while a document is still in flight; WebSocket is the primary channel. */
export function useDocumentStatus(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.document(id ?? 'none'), 'status'],
    queryFn: () => apiClient.get<DocumentStatusDto>(`/api/documents/${id}/status`),
    enabled: enabled && Boolean(id),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === 'UPLOADED' || status === 'PROCESSING' ? 4000 : false
    },
  })
}

export function useUploadDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ file, description }: { file: File; description?: string }) => {
      const form = new FormData()
      form.append('file', file)
      if (description) form.append('description', description)
      return apiClient.upload<DocumentResponse>('/api/documents/upload', form, {
        idempotencyKey: newIdempotencyKey(),
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.documents })
      void queryClient.invalidateQueries({ queryKey: queryKeys.subscription })
    },
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/documents/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.documents })
    },
  })
}

export function useRetryDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.post<ApiResponse>(`/api/documents/${id}/retry`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.documents })
    },
  })
}

export async function downloadDocument(id: string, fileName: string) {
  const token = getAccessToken()
  const response = await fetch(`${apiUrl('/api/documents')}/${id}/download`, {
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!response.ok) throw new Error('Download failed')
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
