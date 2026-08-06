import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { loginUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { isAxiosError } from 'axios'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

 const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  setError('')
  setLoading(true)
  try {
    const response = await loginUser({ identifier, password })
    const access = response.data?.access
    const refresh = response.data?.refresh

    if (!access || !refresh) {
      setError('Сервер не вернул токены авторизации')
      console.error('Неожиданный формат ответа /auth/login:', response.data)
      return
    }

    login(access, refresh, identifier)
    navigate('/profile')
  } catch (err) {
    if (isAxiosError(err)) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || 'Неверные данные для входа')
    } else {
      setError('Ошибка входа')
    }
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <Leaf size={16} strokeWidth={2.5} />
          </span>
          <span className="text-lg font-extrabold text-stone-900">
            Agro<span className="text-brand-500">Bazar</span>
          </span>
        </div>

        <h1 className="mb-6 text-xl font-bold text-stone-900">Вход</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Телефон или email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
          >
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-stone-500">
          Нет аккаунта?{' '}
          <Link to="/register" className="font-semibold text-brand-600">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}