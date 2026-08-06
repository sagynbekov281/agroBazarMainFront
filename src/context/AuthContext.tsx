import { createContext, useContext, useState, useEffect,  } from 'react'
import type { ReactNode } from 'react'
import { getMyProfile } from '../api/profile'


interface AuthState {
  isAuthenticated: boolean
  phone: string | null
  displayName: string
  login: (access: string, refresh: string, phone: string) => void
  logout: () => void
  refreshDisplayName: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

function buildDisplayName(firstName?: string, lastName?: string): string {
  const first = (firstName || '').trim()
  const lastInitial = (lastName || '').trim().charAt(0)
  if (!first) return ''
  return lastInitial ? `${first} ${lastInitial}.` : first
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState<string | null>(
    localStorage.getItem('user_phone')
  )
  const [displayName, setDisplayName] = useState<string>(
    localStorage.getItem('user_display_name') || ''
  )

  const refreshDisplayName = async () => {
    try {
      const { data } = await getMyProfile()
      const name = buildDisplayName(data.first_name, data.last_name)
      if (name) {
        localStorage.setItem('user_display_name', name)
        setDisplayName(name)
      }
    } catch {
      // профиль пока недоступен — молча оставляем то, что уже было
    }
  }

  useEffect(() => {
    if (phone) {
      refreshDisplayName()
    }
  }, [phone])

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
    localStorage.removeItem('user_display_name')
    setPhone(null)
    setDisplayName('')
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!phone, phone, displayName, login, logout, refreshDisplayName }}
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