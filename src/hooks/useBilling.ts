import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient, newIdempotencyKey, qs } from '@/lib/api'
import { queryKeys } from '@/lib/queryClient'
import type {
  ApiResponse,
  CreditTransaction,
  InitializePaymentResponse,
  PaymentStatus,
  PaymentTransaction,
  Subscription,
} from '@/types/api'

export interface SubscriptionTier {
  tier: string
  label: string
  monthlyCredits: number
}

export function useSubscription(enabled = true) {
  return useQuery({
    queryKey: queryKeys.subscription,
    queryFn: () => apiClient.get<Subscription>('/api/subscription'),
    enabled,
  })
}

export function useTiers(enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.subscription, 'tiers'],
    queryFn: () => apiClient.get<SubscriptionTier[]>('/api/subscription/tiers'),
    enabled,
  })
}

export function useCreditTransactions(page = 0, size = 20, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.creditTransactions, page, size],
    queryFn: () =>
      apiClient.get<CreditTransaction[]>(`/api/subscription/transactions${qs({ page, size })}`),
    enabled,
  })
}

export function usePaymentStatus() {
  return useQuery({
    queryKey: [...queryKeys.payments, 'status'],
    queryFn: () => apiClient.get<PaymentStatus>('/api/payments/status', { auth: false }),
    staleTime: 5 * 60_000,
  })
}

export function usePaymentHistory(enabled = true) {
  return useQuery({
    queryKey: queryKeys.payments,
    queryFn: () => apiClient.get<PaymentTransaction[]>('/api/payments/history'),
    enabled,
  })
}

export function useInitializePayment() {
  const queryClient = useQueryClient()
  return useMutation({
    // The key is generated once per mutation call and reused if the caller retries.
    mutationFn: (credits: number) => {
      const idempotencyKey = newIdempotencyKey()
      return apiClient.post<InitializePaymentResponse>(
        '/api/payments/initialize',
        { credits },
        { idempotencyKey },
      )
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.payments })
    },
  })
}

export function useVerifyPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reference: string) =>
      apiClient.get<PaymentTransaction>(`/api/payments/verify${qs({ reference })}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.payments })
      void queryClient.invalidateQueries({ queryKey: queryKeys.subscription })
      void queryClient.invalidateQueries({ queryKey: queryKeys.session })
    },
  })
}

export function useChangeTier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tier: string) =>
      apiClient.put<Subscription>(`/api/subscription/tier${qs({ tier })}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.subscription })
    },
  })
}

export function useAdminGrantCredits() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (credits: number) =>
      apiClient.post<ApiResponse>(
        '/api/subscription/purchase-credits',
        { credits, referenceId: `manual-${crypto.randomUUID()}` },
        { idempotencyKey: newIdempotencyKey() },
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.subscription })
      void queryClient.invalidateQueries({ queryKey: queryKeys.creditTransactions })
      void queryClient.invalidateQueries({ queryKey: queryKeys.session })
    },
  })
}
