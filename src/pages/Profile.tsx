import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { LayoutGrid, BarChart3, Package, MessageSquare, UserCog, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getMyProfile, updateMyProfile,  } from '../api/profile'
import type { ProfileData } from '../api/profile'
import { salesStats, mockOrders, mockMessages } from '../data/profileMock'

type Tab = 'overview' | 'stats' | 'orders' | 'messages' | 'settings'

const tabs: { id: Tab; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'overview', label: 'Обзор', icon: LayoutGrid },
  { id: 'stats', label: 'Статистика', icon: BarChart3 },
  { id: 'orders', label: 'Заказы', icon: Package },
  { id: 'messages', label: 'Сообщения', icon: MessageSquare },
  { id: 'settings', label: 'Профиль', icon: UserCog },
]

export default function Profile() {
  const { isAuthenticated, logout, refreshDisplayName } = useAuth()
  const [tab, setTab] = useState<Tab>('overview')
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [form, setForm] = useState<Partial<ProfileData>>({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) return
    getMyProfile()
      .then(({ data }) => {
        setProfile(data)
        setForm(data)
      })
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await updateMyProfile(form)
      setProfile(data)
      await refreshDisplayName()
    } finally {
      setSaving(false)
    }
  }

  const maxStat = Math.max(...salesStats.map((s) => s.value))

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="flex flex-row gap-2 overflow-x-auto rounded-2xl bg-white p-3 shadow-sm lg:flex-col lg:overflow-visible">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                tab === id
                  ? 'bg-brand-500 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
          <button
            onClick={logout}
            className="mt-auto flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} />
            Выйти
          </button>
        </aside>

        {/* Content */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          {loading ? (
            <p className="text-sm text-stone-400">Загрузка...</p>
          ) : (
            <>
              {tab === 'overview' && (
                <div>
                  <h2 className="mb-1 text-xl font-bold text-stone-900">
                    Здравствуйте, {profile?.first_name || 'пользователь'}!
                  </h2>
                  <p className="mb-6 text-sm text-stone-500">
                    {profile?.role === 'farmer' ? 'Продавец' : 'Покупатель'}
                    {profile?.region ? ` · ${profile.region}` : ''}
                    {profile?.farm_name ? ` · ${profile.farm_name}` : ''}
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-stone-50 p-4">
                      <p className="text-xs text-stone-500">Заказов</p>
                      <p className="text-2xl font-bold text-stone-900">{mockOrders.length}</p>
                    </div>
                    <div className="rounded-xl bg-stone-50 p-4">
                      <p className="text-xs text-stone-500">Непрочитанных сообщений</p>
                      <p className="text-2xl font-bold text-stone-900">
                        {mockMessages.filter((m) => m.unread).length}
                      </p>
                    </div>
                    <div className="rounded-xl bg-stone-50 p-4">
                      <p className="text-xs text-stone-500">Продажи за неделю</p>
                      <p className="text-2xl font-bold text-stone-900">
                        {salesStats.reduce((s, x) => s + x.value, 0).toLocaleString()} сом
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'stats' && (
                <div>
                  <h2 className="mb-6 text-xl font-bold text-stone-900">Статистика продаж</h2>
                  <div className="flex h-56 items-end gap-3">
                    {salesStats.map((s) => (
                      <div key={s.label} className="flex flex-1 flex-col items-center gap-2">
                        <div
                          className="w-full rounded-t-lg bg-brand-500"
                          style={{ height: `${(s.value / maxStat) * 100}%` }}
                        />
                        <span className="text-xs text-stone-500">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'orders' && (
                <div>
                  <h2 className="mb-6 text-xl font-bold text-stone-900">Заказы</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-stone-100 text-stone-500">
                          <th className="pb-2 font-medium">№</th>
                          <th className="pb-2 font-medium">Товар</th>
                          <th className="pb-2 font-medium">Покупатель</th>
                          <th className="pb-2 font-medium">Кол-во</th>
                          <th className="pb-2 font-medium">Статус</th>
                          <th className="pb-2 font-medium">Сумма</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockOrders.map((o) => (
                          <tr key={o.id} className="border-b border-stone-50">
                            <td className="py-3 text-stone-500">#{o.id}</td>
                            <td className="py-3 font-medium text-stone-900">{o.product}</td>
                            <td className="py-3 text-stone-600">{o.buyer}</td>
                            <td className="py-3 text-stone-600">{o.amount} кг</td>
                            <td className="py-3">
                              <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">
                                {o.status}
                              </span>
                            </td>
                            <td className="py-3 font-semibold text-stone-900">
                              {o.total.toLocaleString()} сом
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === 'messages' && (
                <div>
                  <h2 className="mb-6 text-xl font-bold text-stone-900">Сообщения</h2>
                  <div className="flex flex-col divide-y divide-stone-100">
                    {mockMessages.map((m) => (
                      <div key={m.id} className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-semibold text-stone-900">{m.from}</p>
                          <p className="text-sm text-stone-500">{m.preview}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-stone-400">{m.time}</span>
                          {m.unread && <span className="h-2 w-2 rounded-full bg-brand-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'settings' && (
                <div>
                  <h2 className="mb-6 text-xl font-bold text-stone-900">Данные профиля</h2>
                  <form onSubmit={handleSave} className="flex max-w-md flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Имя"
                        value={form.first_name || ''}
                        onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                        className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
                      />
                      <input
                        type="text"
                        placeholder="Фамилия"
                        value={form.last_name || ''}
                        onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                        className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Регион"
                      value={form.region || ''}
                      onChange={(e) => setForm({ ...form, region: e.target.value })}
                      className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
                    />
                    {profile?.role === 'farmer' && (
                      <input
                        type="text"
                        placeholder="Название хозяйства"
                        value={form.farm_name || ''}
                        onChange={(e) => setForm({ ...form, farm_name: e.target.value })}
                        className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
                      />
                    )}
                    <textarea
                      placeholder="О себе"
                      value={form.bio || ''}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      rows={3}
                      className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
                    />
                    <p className="text-sm text-stone-400">
                      Телефон: {profile?.phone} (нельзя изменить)
                    </p>
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
                    >
                      {saving ? 'Сохранение...' : 'Сохранить'}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}