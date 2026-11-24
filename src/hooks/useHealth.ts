import { useQuery } from '@tanstack/react-query'
import { apiClient, qs } from '@/lib/api'
import { queryKeys } from '@/lib/queryClient'
import type { HealthStatus } from '@/types/api'

export interface HealthMetric {
  id: string
  checkType: string
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY'
  responseTimeMs?: number
  message?: string
  cpuUsagePercent?: number
  memoryUsagePercent?: number
  diskAvailableBytes?: number
  createdAt: string
}

export function useHealth(enabled = true) {
  return useQuery({
    queryKey: queryKeys.healthSummary,
    queryFn: () => apiClient.get<HealthStatus>('/api/health', { auth: false }),
    enabled,
    refetchInterval: 30_000,
  })
}

export function useHealthHistory(checkType: string, days = 7, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.healthMetrics, checkType, days],
    queryFn: () =>
      apiClient.get<HealthMetric[]>(`/api/health/history/${checkType}${qs({ days })}`, {
        auth: false,
      }),
    enabled: enabled && Boolean(checkType),
  })
}
