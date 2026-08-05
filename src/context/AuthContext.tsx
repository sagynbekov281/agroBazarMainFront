import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface AuthState {
  isAuthenticated: boolean
  phone: string | null
  login: (access: string, refresh: string, phone: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState<string | null>(
    localStorage.getItem('user_phone')
  )

  const login = (access: string, refresh: string, userPhone: string) => {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    localStorage.setItem('user_phone', userPhone)
    setPhone(userPhone)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_phone')
    setPhone(null)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!phone, phone, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}