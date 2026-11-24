import { createContext } from 'react'
import type { CurrentUser, LoginRequest, RegisterRequest } from '@/types/api'

export interface AuthContextValue {
  user: CurrentUser | undefined
  credits: number | undefined
  isAuthenticated: boolean
  isLoading: boolean
  login: (input: LoginRequest) => Promise<void>
  register: (input: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
