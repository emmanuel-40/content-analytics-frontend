import { useEffect, useState } from 'react'
import { getAccessToken, onAccessTokenChange } from '@/lib/api'

/** Mirrors the in-memory bearer token into React state for STOMP connections. */
export function useAccessToken(): string | null {
  const [token, setToken] = useState<string | null>(getAccessToken())

  useEffect(() => onAccessTokenChange(setToken), [])

  return token
}
