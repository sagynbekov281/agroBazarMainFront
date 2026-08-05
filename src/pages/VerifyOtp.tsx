import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { verifyOtp } from '../api/auth'
import { isAxiosError } from 'axios'

export default function VerifyOtp() {
  const navigate = useNavigate()
  const location = useLocation()
  const phone = (location.state as { phone?: string })?.phone

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!phone) {
    return <Navigate to="/register" replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await verifyOtp({ phone, code })
      navigate('/login')
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.error?.details?.code || 'Неверный код')
      } else {
        setError('Ошибка проверки кода')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-xl font-bold text-stone-900">
          Подтверждение
        </h1>
        <p className="mb-6 text-sm text-stone-500">
          Код отправлен на {phone}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Код из SMS"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="rounded-lg border border-stone-200 px-4 py-2.5 text-center text-lg tracking-widest outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
          >
            {loading ? 'Проверка...' : 'Подтвердить'}
          </button>
        </form>
      </div>
    </div>
  )
}