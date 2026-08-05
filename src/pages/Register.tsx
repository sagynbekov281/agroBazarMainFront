import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { registerUser } from '../api/auth'
import { isAxiosError } from 'axios'

export default function Register() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'farmer' | 'buyer'>('buyer')
  const [region, setRegion] = useState('')
  const [farmName, setFarmName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await registerUser({
        phone,
        email: email || undefined,
        password,
        role,
        first_name: firstName,
        last_name: lastName,
        region: region || undefined,
        farm_name: role === 'farmer' ? farmName || undefined : undefined,
      })
      navigate('/verify-otp', { state: { phone } })
    } catch (err) {
      if (isAxiosError(err)) {
        const data = err.response?.data
        const message =
          data?.error?.message ||
          Object.values(data?.error?.details || data || {})[0] ||
          'Ошибка регистрации'
        setError(String(message))
      } else {
        setError('Ошибка регистрации')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <Leaf size={16} strokeWidth={2.5} />
          </span>
          <span className="text-lg font-extrabold text-stone-900">
            Agro<span className="text-brand-500">Bazar</span>
          </span>
        </div>

        <h1 className="mb-6 text-xl font-bold text-stone-900">Регистрация</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`flex-1 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                role === 'buyer'
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-stone-200 text-stone-500'
              }`}
            >
              Покупатель
            </button>
            <button
              type="button"
              onClick={() => setRole('farmer')}
              className={`flex-1 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                role === 'farmer'
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-stone-200 text-stone-500'
              }`}
            >
              Продавец / Фермер
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Имя"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
            />
            <input
              type="text"
              placeholder="Фамилия"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <input
            type="tel"
            placeholder="+996700123456"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
          />
          <input
            type="email"
            placeholder="Email (необязательно)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
          />
          <input
            type="text"
            placeholder="Регион (например, Чуйская обл.)"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
          />

          {role === 'farmer' && (
            <input
              type="text"
              placeholder="Название хозяйства / фермы"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
            />
          )}

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
            {loading ? 'Отправка...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-stone-500">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="font-semibold text-brand-600">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}