import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 10 * 60_000,
      retry: (failureCount, error) => {
        const status = (error as { status?: number })?.status
        if (status && status >= 400 && status < 500 && status !== 429) return false
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
    mutations: { retry: false },
  },
})

export const queryKeys = {
  session: ['session'] as const,
  providers: ['providers'] as const,
  profile: ['profile'] as const,
  documents: ['documents'] as const,
  document: (id: string) => ['documents', id] as const,
  subscription: ['subscription'] as const,
  credits: ['credits'] as const,
  creditTransactions: ['credits', 'transactions'] as const,
  payments: ['payments'] as const,
  paymentsFor: (reference: string) => ['payments', reference] as const,
  healthMetrics: ['health', 'metrics'] as const,
  healthSummary: ['health', 'summary'] as const,
}
