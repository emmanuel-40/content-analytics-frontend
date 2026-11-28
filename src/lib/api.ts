import type { ApiErrorBody } from '@/types/api'

const configuredOrigin =
  import.meta.env.VITE_API_URL ?? import.meta.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

export const API_ORIGIN = configuredOrigin.replace(/\/$/, '')
export const apiUrl = (path: string) => `${API_ORIGIN}${path}`

const WS_CONFIGURED = import.meta.env.VITE_WS_URL
export const WS_URL = WS_CONFIGURED
  ? WS_CONFIGURED.replace(/\/$/, '')
  : API_ORIGIN.replace(/^http/, 'ws')

export class ApiError extends Error {
  readonly status: number
  readonly body?: ApiErrorBody
  readonly fieldErrors: Record<string, string>

  constructor(status: number, body?: ApiErrorBody) {
    super(body?.message ?? `Request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.body = body
    this.fieldErrors = body?.errors ?? {}
  }
}

// ── Session token (memory only, never persisted to storage) ──────────────
let accessToken: string | null = null
const tokenListeners = new Set<(token: string | null) => void>()
const sessionExpiredHandlers = new Set<() => void>()

export const getAccessToken = () => accessToken
export function setAccessToken(token: string | null) {
  accessToken = token
  tokenListeners.forEach((listener) => listener(token))
}
export function onAccessTokenChange(listener: (token: string | null) => void) {
  tokenListeners.add(listener)
  return () => {
    tokenListeners.delete(listener)
  }
}
export function onSessionExpired(handler: () => void) {
  sessionExpiredHandlers.add(handler)
  return () => {
    sessionExpiredHandlers.delete(handler)
  }
}
function notifySessionExpired() {
  sessionExpiredHandlers.forEach((handler) => handler())
}

// ── CSRF ──────────────────────────────────────────────────────────────────
let csrfToken: string | null = null
export function setCsrfToken(token: string | null) {
  csrfToken = token
}

function cookieValue(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

async function getCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken
  try {
    const res = await fetch(apiUrl('/api/auth/csrf'), { credentials: 'include' })
    if (res.ok) {
      const data = (await res.json()) as { token?: string; headerName?: string }
      if (data.token) {
        csrfToken = data.token
        return data.token
      }
    }
  } catch {
    // fall through to cookie
  }
  const fromCookie = cookieValue('XSRF-TOKEN')
  csrfToken = fromCookie ?? ''
  return csrfToken ?? ''
}

// ── Single-flight refresh ─────────────────────────────────────────────────
let refreshPromise: Promise<boolean> | undefined

export async function refreshSession(): Promise<boolean> {
  if (refreshPromise) return refreshPromise
  const attempt = (async () => {
    try {
      const res = await fetch(apiUrl('/api/auth/refresh'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      })
      if (!res.ok) return false
      const payload = (await res.json()) as { data?: { accessToken?: string } }
      const token = payload?.data?.accessToken
      if (!token) return false
      setAccessToken(token)
      csrfToken = null
      return true
    } catch {
      return false
    }
  })()
  refreshPromise = attempt
  try {
    return await attempt
  } finally {
    refreshPromise = undefined
  }
}

/**
 * JWT payload expiry is public (signature is what makes it trustworthy). Refreshing a few
 * seconds before `exp` avoids a wasted 401 round trip and the scary console error that
 * comes with it, while the 401 retry below remains the safety net for clock skew.
 */
function tokenIsExpiring(token: string | null): boolean {
  if (!token) return false
  try {
    const segment = token.split('.')[1]
    if (!segment) return false
    const payload = JSON.parse(atob(segment.replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number }
    return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now() + 5_000
  } catch {
    return false
  }
}

// ── Core request ──────────────────────────────────────────────────────────
export interface RequestOptions {
  body?: unknown
  headers?: Record<string, string>
  /** Send the Authorization header from the in-memory access token. */
  auth?: boolean
  /** Send X-XSRF-TOKEN (default true for mutations). */
  csrf?: boolean
  idempotencyKey?: string
  signal?: AbortSignal
  retryOn401?: boolean
}

async function request<T>(path: string, options: RequestOptions & { method: string }): Promise<T> {
  const {
    method,
    body,
    headers = {},
    auth = true,
    csrf = method !== 'GET' && method !== 'HEAD',
    idempotencyKey,
    signal,
    retryOn401 = true,
  } = options

  if (auth && retryOn401 && tokenIsExpiring(accessToken)) {
    const refreshed = await refreshSession()
    if (!refreshed) notifySessionExpired()
  }

  const finalHeaders: Record<string, string> = { ...headers }
  let payload: BodyInit | undefined

  if (body instanceof FormData) {
    payload = body
  } else if (body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  if (csrf) finalHeaders['X-XSRF-TOKEN'] = await getCsrfToken()
  if (auth && accessToken) finalHeaders['Authorization'] = `Bearer ${accessToken}`
  if (idempotencyKey) finalHeaders['Idempotency-Key'] = idempotencyKey

  let res: Response
  try {
    res = await fetch(apiUrl(path), {
      method,
      headers: finalHeaders,
      body: payload,
      credentials: 'include',
      signal,
    })
  } catch (error) {
    if ((error as Error)?.name === 'AbortError') throw error
    throw new ApiError(0, { status: 0, message: 'Network error. Please try again.' })
  }

  if (res.status === 401 && auth && retryOn401) {
    const refreshed = await refreshSession()
    if (refreshed) return request<T>(path, { ...options, retryOn401: false })
    notifySessionExpired()
  }

  if (!res.ok) {
    let parsed: ApiErrorBody | undefined
    try {
      parsed = (await res.json()) as ApiErrorBody
    } catch {
      parsed = { status: res.status, message: res.statusText || 'Request failed' }
    }
    throw new ApiError(res.status, parsed)
  }

  if (res.status === 204) return undefined as T
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export const apiClient = {
  get: <T>(path: string, options: RequestOptions = {}) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options: RequestOptions = {}) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options: RequestOptions = {}) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  delete: <T>(path: string, options: RequestOptions = {}) =>
    request<T>(path, { ...options, method: 'DELETE' }),
  upload: <T>(path: string, formData: FormData, options: RequestOptions = {}) =>
    request<T>(path, { ...options, method: 'POST', body: formData }),
}

/** Stable idempotency key helper for checkout and admin credit grants. */
export function newIdempotencyKey(): string {
  return crypto.randomUUID()
}

/** Build a query string, skipping null/undefined/empty values. */
export function qs(params: Record<string, string | number | boolean | null | undefined>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') continue
    search.set(key, String(value))
  }
  const result = search.toString()
  return result ? `?${result}` : ''
}
