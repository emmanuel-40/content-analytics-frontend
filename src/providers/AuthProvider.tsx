import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, type ReactNode } from 'react'
import {
  ApiError,
  apiClient,
  onSessionExpired,
  refreshSession,
  setAccessToken,
} from '@/lib/api'
import { queryKeys } from '@/lib/queryClient'
import { AuthContext, type AuthContextValue } from '@/hooks/authContext'
import type {
  ApiResponse,
  CurrentUser,
  LoginRequest,
  RegisterRequest,
  Subscription,
  TokenResponse,
} from '@/types/api'

/**
 * Cookies are the primary browser credential. The in-memory token is needed
 * only for STOMP CONNECT, which cannot read the HttpOnly access-token cookie.
 * Refreshing here also rotates tokens, so an old/stolen refresh token dies.
 */
async function bootstrapSession(): Promise<CurrentUser | null> {
  const refreshed = await refreshSession()
  if (!refreshed) return null
  return apiClient.get<CurrentUser>('/api/auth/me')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery({
    queryKey: queryKeys.session,
    queryFn: bootstrapSession,
    staleTime: Infinity,
    retry: false,
  })

  const { data: subscription } = useQuery({
    queryKey: queryKeys.subscription,
    queryFn: () => apiClient.get<Subscription>('/api/subscription'),
    enabled: Boolean(user),
  })

  useEffect(() => {
    onSessionExpired(() => {
      setAccessToken(null)
      queryClient.setQueryData(queryKeys.session, null)
      queryClient.clear()
    })
    return () => onSessionExpired(() => {})
  }, [queryClient])

  const login = useCallback(
    async (input: LoginRequest) => {
      const tokens = await apiClient.post<TokenResponse>('/api/auth/login', input, { auth: false })
      setAccessToken(tokens.accessToken)
      const me = await apiClient.get<CurrentUser>('/api/auth/me')
      queryClient.setQueryData(queryKeys.session, me)
    },
    [queryClient],
  )

  const register = useCallback(async (input: RegisterRequest) => {
    await apiClient.post<ApiResponse>('/api/auth/register', input, { auth: false })
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/api/auth/logout')
    } finally {
      setAccessToken(null)
      queryClient.clear()
    }
  }, [queryClient])

  const refresh = useCallback(async () => {
    const refreshed = await refreshSession()
    if (!refreshed) throw new ApiError(401, { status: 401, message: 'Session expired' })
    const me = await apiClient.get<CurrentUser>('/api/auth/me')
    queryClient.setQueryData(queryKeys.session, me)
  }, [queryClient])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? undefined,
      credits: subscription?.availableCredits,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      refresh,
    }),
    [user, subscription, isLoading, login, register, logout, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
