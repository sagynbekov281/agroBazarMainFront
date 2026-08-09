import { useState } from 'react'
import { useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import {
  LogOut,
  Leaf,
  Check,
  Pencil,
  Star,
  Send,
  Paperclip,
  Eye,
  Copy,
  MapPin,
  Phone,
  Plus,
  ChevronDown,
  ChevronLeft,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getMyProfile, updateMyProfile } from '../api/profile'
import type { ProfileData } from '../api/profile'
import { mockMessages } from '../data/profileMock'

// Брендовые цвета AgroBazar — вынесите в tailwind.config при желании:
// brand.green = '#3DA35D', brand.amber = '#E3A83F', brand.dark = '#242424'

type Tab = 'stats' | 'products' | 'add_product' | 'orders' | 'messages' | 'settings'

const tabs: { id: Tab; label: string }[] = [
  { id: 'stats', label: 'Статистика' },
  { id: 'products', label: 'Мои товары' },
  { id: 'add_product', label: 'Добавить товар' },
  { id: 'orders', label: 'Заказы' },
  { id: 'messages', label: 'Чаты' },
  { id: 'settings', label: 'Профиль' },
]

// ─────────────────────────────────────────────────────────────
// Данные ниже — заглушки под дизайн. Замените на реальные вызовы
// API (getMyProducts, getMyOrders, getSalesStats и т.д.), когда
// эндпоинты будут готовы на бэкенде.
// ─────────────────────────────────────────────────────────────

const verificationItems = [
  { label: 'Паспорт', status: 'verified' as const },
  { label: 'Свид.о земле', status: 'verified' as const },
  { label: 'Справка от ветнадзора', status: 'pending' as const },
]

const monthlyRevenue = [
  { label: 'Янв', value: 98000 },
  { label: 'Фев', value: 172000 },
  { label: 'Март', value: 140000 },
  { label: 'Апр', value: 76000 },
  { label: 'Май', value: 118000 },
  { label: 'Июнь', value: 160000 },
  { label: 'Июль', value: 184300 },
]

const topProducts = [
  { name: 'Помидоры грунтовые', sold: 'Продано 120 кг', total: 62400 },
  { name: 'Картофель семенной', sold: 'Продано 1.1 т', total: 41800 },
  { name: 'Морковь', sold: 'Продано 670 кг', total: 28600 },
]

type MyProduct = {
  id: number
  name: string
  price: number
  unit: string
  remaining: number
  date: string
  sold: number
  views: string
  status: 'active' | 'pending' | 'archived'
}

const myProducts: MyProduct[] = [
  {
    id: 1,
    name: 'Помидоры грунтовые',
    price: 72,
    unit: 'кг',
    remaining: 400,
    date: '25.04.26',
    sold: 567,
    views: '4.5K',
    status: 'active',
  },
  {
    id: 2,
    name: 'Клубника',
    price: 150,
    unit: 'кг',
    remaining: 100,
    date: '27.07.26',
    sold: 30,
    views: '200',
    status: 'active',
  },
]

const productCategories = ['Овощи', 'Фрукты', 'Зерновые', 'Молочные', 'Мясо', 'Животные', 'Другое']

type FarmerOrder = {
  id: number
  buyer: string
  product: string
  qty: string
  remaining: string
  date: string
  paid: boolean
  status: 'new' | 'in_progress' | 'done' | 'cancelled'
  total: number
}

const farmerOrders: FarmerOrder[] = [
  {
    id: 67,
    buyer: 'Кафе "Достук"',
    product: 'малина',
    qty: '3кг',
    remaining: '50кг',
    date: '27.07.26',
    paid: true,
    status: 'new',
    total: 6600,
  },
]

const orderSubTabs: { id: FarmerOrder['status']; label: string }[] = [
  { id: 'new', label: 'Новые' },
  { id: 'in_progress', label: 'В работе' },
  { id: 'done', label: 'Завершены' },
  { id: 'cancelled', label: 'Отмененные' },
]

const productSubTabs: { id: MyProduct['status']; label: string }[] = [
  { id: 'active', label: 'Активные' },
  { id: 'pending', label: 'На рассмотрении' },
  { id: 'archived', label: 'Архив' },
]

export default function Profile() {
  const { isAuthenticated, logout, refreshDisplayName } = useAuth()
  const [tab, setTab] = useState<Tab>('stats')
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [form, setForm] = useState<Partial<ProfileData> & { email?: string | null }>({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeChatId, setActiveChatId] = useState<string | number | null>(null)
  const [draft, setDraft] = useState('')

  const [statsPeriod, setStatsPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [productSubTab, setProductSubTab] = useState<MyProduct['status']>('active')
  const [orderSubTab, setOrderSubTab] = useState<FarmerOrder['status']>('new')

  // Форма добавления товара — локальный черновик, не привязан к API.
  const [newProduct, setNewProduct] = useState({
    name: 'Помидоры грунтовые',
    category: 'Овощи',
    stockQty: '4000',
    wholesalePrice: '72',
    wholesaleUnit: 'кг' as 'кг' | 'тонна',
    availableQty: '',
    availableUnit: 'кг' as 'кг' | 'тонна',
    region: 'Чуйская обл',
    locationText: '',
    phone: '+996 700 000 067',
    description: 'Свежие грунтовые помидоры,сорт "Бычье сердце"\nСбор ежедневный,отгрузка оптом.Возможна доставка по региону',
  })
  const [categoryOpen, setCategoryOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    getMyProfile()
      .then(({ data }) => {
        setProfile(data)
        setForm({
          ...data,
          email: data.email ?? undefined,
        })
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

  const maxRevenue = Math.max(...monthlyRevenue.map((s) => s.value))
  const displayName =
    `${profile?.first_name || ''} ${profile?.last_name?.[0] ? profile.last_name[0] + '.' : ''}`.trim() ||
    'Пользователь'

  const visibleProducts = myProducts.filter((p) => p.status === productSubTab)
  const visibleOrders = farmerOrders.filter((o) => o.status === orderSubTab)

  return (
    <div
      className="min-h-screen bg-stone-100"
      style={{ fontFamily: "'Nunito', system-ui, sans-serif" }}
    >
      {/* Sidebar — на десктопе зафиксирована на весь экран по высоте, слева, без отступов */}
      <aside className="flex w-full flex-col bg-[#242424] p-4 text-stone-400 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64 lg:overflow-y-auto lg:rounded-none">
        <Link
          to="/"
          className="mb-6 flex items-center gap-2 px-2 pt-1 transition hover:opacity-80"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#3DA35D]">
            <Leaf size={16} className="text-white" />
          </span>
          <span className="text-lg font-extrabold">
            <span className="text-[#E3A83F]">Agro</span>
            <span className="text-[#3DA35D]">Bazar</span>
          </span>
        </Link>

        <nav className="flex flex-row flex-wrap gap-1 lg:flex-col">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex shrink-0 items-center gap-3 rounded-full px-3.5 py-2.5 text-sm font-bold transition ${
                tab === id
                  ? 'bg-[#3DA35D] text-white'
                  : 'text-stone-400 hover:bg-white/5 hover:text-stone-200'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  tab === id ? 'bg-white' : 'bg-stone-500'
                }`}
              />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-4 lg:mt-6">
          <div className="h-9 w-9 shrink-0 rounded-full bg-stone-600" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{displayName}</p>
            <p className="truncate text-xs font-semibold text-[#3DA35D]">
              {profile?.role === 'farmer' ? 'Фермер' : 'Покупатель'}
              {(profile as ProfileData & { is_vip?: boolean })?.is_vip ? ' · VIP' : ''}
            </p>
          </div>
          <button
            onClick={logout}
            className="shrink-0 rounded-lg p-1.5 text-red-500 hover:bg-white/5"
            aria-label="Выйти"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Content — на десктопе сдвинут вправо на ширину фиксированной панели */}
      <div className="lg:pl-64">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="flex-1">
          {loading ? (
            <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
              <p className="text-sm text-stone-400">Загрузка...</p>
            </div>
          ) : (
            <>
              {/* ── Статистика ───────────────────────────────── */}
              {tab === 'stats' && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-extrabold text-stone-900">Статистика продаж</h1>
                    <div className="flex items-center gap-1 rounded-full bg-white p-1 text-sm font-bold shadow-sm">
                      {(['week', 'month', 'year'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setStatsPeriod(p)}
                          className={`rounded-full px-3 py-1.5 transition ${
                            statsPeriod === p
                              ? 'bg-[#3DA35D] text-white'
                              : 'text-stone-400 hover:text-stone-600'
                          }`}
                        >
                          {p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Год'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
                      <p className="text-xs text-stone-400">Выручка за месяц</p>
                      <p className="mt-1 text-xl font-extrabold text-stone-900">184 300 сом</p>
                      <p className="mt-1 text-xs font-bold text-[#3DA35D]">+6.7%</p>
                    </div>
                    <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
                      <p className="text-xs text-stone-400">Заказов</p>
                      <p className="mt-1 text-xl font-extrabold text-stone-900">96</p>
                      <p className="mt-1 text-xs font-bold text-[#3DA35D]">+8% за неделю</p>
                    </div>
                    <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
                      <p className="text-xs text-stone-400">Рейтинг</p>
                      <p className="mt-1 flex items-center gap-1 text-xl font-extrabold text-[#E3A83F]">
                        <Star size={16} className="fill-[#E3A83F] text-[#E3A83F]" /> 5.0
                      </p>
                      <p className="mt-1 text-xs text-stone-400">228 отзывов</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 text-sm font-semibold text-stone-400">Выручка по месяцам</h3>
                    <div className="flex h-48 items-end gap-3">
                      {monthlyRevenue.map((s, i) => (
                        <div key={s.label} className="flex flex-1 flex-col items-center gap-2">
                          <div
                            className={`w-full rounded-t-lg ${
                              i === monthlyRevenue.length - 1 ? 'bg-[#2E7D4F]' : 'bg-[#3DA35D]/20'
                            }`}
                            style={{ height: `${(s.value / maxRevenue) * 100}%` }}
                          />
                          <span className="text-xs text-stone-400">{s.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-sm font-semibold text-stone-400">Топ товаров</h3>
                    <div className="flex flex-col divide-y divide-stone-100">
                      {topProducts.map((p) => (
                        <div key={p.name} className="flex items-center justify-between py-3">
                          <div>
                            <p className="font-extrabold text-stone-900">{p.name}</p>
                            <p className="text-sm text-stone-400">{p.sold}</p>
                          </div>
                          <p className="font-extrabold text-stone-900">
                            {p.total.toLocaleString()} сом
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Мои товары ───────────────────────────────── */}
              {tab === 'products' && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-extrabold text-stone-900">Мои товары</h1>
                    <button
                      onClick={() => setTab('add_product')}
                      className="flex items-center gap-1.5 rounded-full bg-[#3DA35D] px-4 py-2.5 text-sm font-bold text-white hover:opacity-90"
                    >
                      <Plus size={16} /> Добавить товар
                    </button>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-600 sm:w-fit">
                    <MapPin size={15} className="text-stone-400" />
                    <span>Чуйская область, с. Кызыл-Аскер</span>
                    <ChevronDown size={15} className="text-stone-400" />
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold">
                    {productSubTabs.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setProductSubTab(t.id)}
                        className={`rounded-full px-3.5 py-1.5 transition ${
                          productSubTab === t.id
                            ? 'bg-[#3DA35D] text-white'
                            : 'text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3">
                    {visibleProducts.length === 0 && (
                      <div className="rounded-2xl border border-stone-100 bg-white p-6 text-center text-sm text-stone-400 shadow-sm">
                        Пока нет товаров в этой категории.
                      </div>
                    )}
                    {visibleProducts.map((p) => (
                      <div
                        key={p.id}
                        className="flex flex-wrap items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
                      >
                        <div className="h-14 w-14 shrink-0 rounded-xl bg-stone-200" />
                        <div className="min-w-[160px] flex-1">
                          <p className="font-extrabold text-stone-900">{p.name}</p>
                          <p className="text-sm text-stone-500">
                            {p.price} сом/{p.unit} · осталось {p.remaining}
                            {p.unit}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-stone-400">
                            <span>{p.date}</span>
                            <span className="flex items-center gap-1 font-bold text-[#3DA35D]">
                              🛍 {p.sold}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-stone-400">
                          <Eye size={15} />
                          {p.views}
                        </div>
                        <button
                          className="text-stone-400 hover:text-stone-600"
                          aria-label="Дублировать товар"
                        >
                          <Copy size={15} />
                        </button>
                        <span className="rounded-full bg-[#3DA35D]/10 px-3 py-1 text-xs font-bold text-[#2E7D4F]">
                          {p.status === 'active' ? 'Активен' : p.status === 'pending' ? 'На проверке' : 'В архиве'}
                        </span>
                        <button className="rounded-xl border border-stone-200 px-3.5 py-1.5 text-xs font-bold text-stone-600 hover:bg-stone-50">
                          Изменить
                        </button>
                        <button className="rounded-xl border border-red-200 px-3.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50">
                          Удалить
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Добавить товар ───────────────────────────── */}
              {tab === 'add_product' && (
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => setTab('products')}
                    className="flex w-fit items-center gap-1 text-sm font-bold text-stone-500 hover:text-stone-800"
                  >
                    <ChevronLeft size={16} /> Назад
                  </button>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-extrabold text-stone-900">Добавить товар</h1>
                    <div className="flex items-center gap-2">
                      <button className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-stone-600 hover:bg-stone-50">
                        Черновик
                      </button>
                      <button className="rounded-full bg-[#3DA35D] px-4 py-2 text-sm font-bold text-white hover:opacity-90">
                        Опубликовать
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-sm font-semibold text-stone-400">Основное</h3>

                    <div className="flex flex-col gap-5">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-stone-400">
                          Название товара:
                        </label>
                        <input
                          type="text"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm font-semibold text-stone-800 outline-none focus:border-[#3DA35D] focus:ring-2 focus:ring-[#3DA35D]/20"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="relative">
                          <label className="mb-1.5 block text-xs font-semibold text-stone-400">
                            Категория:
                          </label>
                          <button
                            type="button"
                            onClick={() => setCategoryOpen((v) => !v)}
                            className="flex w-full items-center justify-between rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-800 outline-none focus:border-[#3DA35D]"
                          >
                            {newProduct.category}
                            <ChevronDown size={15} className="text-stone-400" />
                          </button>
                          {categoryOpen && (
                            <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-stone-200 bg-white text-sm font-semibold shadow-lg">
                              {productCategories.map((c) => (
                                <button
                                  key={c}
                                  type="button"
                                  onClick={() => {
                                    setNewProduct({ ...newProduct, category: c })
                                    setCategoryOpen(false)
                                  }}
                                  className={`block w-full px-4 py-2.5 text-left ${
                                    c === newProduct.category
                                      ? 'bg-[#3DA35D] text-white'
                                      : 'text-stone-700 hover:bg-stone-50'
                                  }`}
                                >
                                  {c}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-stone-400">
                            Количество на складе:
                          </label>
                          <div className="flex items-center rounded-xl border border-stone-200 px-4 py-2.5">
                            <input
                              type="text"
                              value={newProduct.stockQty}
                              onChange={(e) =>
                                setNewProduct({ ...newProduct, stockQty: e.target.value })
                              }
                              className="w-full text-sm font-semibold text-stone-800 outline-none"
                            />
                            <span className="shrink-0 text-xs font-bold text-stone-400">кг</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold text-stone-400">
                          Фото и Видео
                        </label>
                        <div className="flex flex-wrap gap-3">
                          <div className="relative h-20 w-20 rounded-xl bg-stone-200">
                            <span className="absolute left-1 top-1 rounded-full bg-[#3DA35D] px-1.5 py-0.5 text-[9px] font-bold text-white">
                              Главное
                            </span>
                          </div>
                          <div className="h-20 w-20 rounded-xl bg-stone-200" />
                          <div className="h-20 w-20 rounded-xl bg-stone-200" />
                          <button
                            type="button"
                            className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-stone-300 text-stone-400 hover:border-[#3DA35D] hover:text-[#3DA35D]"
                          >
                            <Plus size={16} />
                            <span className="text-[10px] font-bold">Фото/Видео</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-stone-400">
                            Оптовая цена
                          </label>
                          <div className="flex items-center rounded-xl border border-stone-200 px-4 py-2.5">
                            <input
                              type="text"
                              value={newProduct.wholesalePrice}
                              onChange={(e) =>
                                setNewProduct({ ...newProduct, wholesalePrice: e.target.value })
                              }
                              className="w-full text-sm font-semibold text-stone-800 outline-none"
                            />
                            <span className="shrink-0 text-xs font-bold text-stone-400">
                              сом/{newProduct.wholesaleUnit === 'кг' ? 'кг' : 'т'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-stone-400">
                            Единица
                          </label>
                          <div className="flex items-center gap-1 rounded-xl bg-stone-100 p-1">
                            {(['кг', 'тонна'] as const).map((u) => (
                              <button
                                key={u}
                                type="button"
                                onClick={() => setNewProduct({ ...newProduct, wholesaleUnit: u })}
                                className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
                                  newProduct.wholesaleUnit === u
                                    ? 'bg-[#3DA35D] text-white'
                                    : 'text-stone-500'
                                }`}
                              >
                                {u}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-stone-400">
                            Кол-во в наличии
                          </label>
                          <input
                            type="text"
                            placeholder="Введите количество"
                            value={newProduct.availableQty}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, availableQty: e.target.value })
                            }
                            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-800 outline-none placeholder:font-normal placeholder:text-stone-400 focus:border-[#3DA35D] focus:ring-2 focus:ring-[#3DA35D]/20"
                          />
                        </div>
                        <div className="flex items-end">
                          <div className="flex w-full items-center gap-1 rounded-xl bg-stone-100 p-1">
                            {(['кг', 'тонна'] as const).map((u) => (
                              <button
                                key={u}
                                type="button"
                                onClick={() => setNewProduct({ ...newProduct, availableUnit: u })}
                                className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
                                  newProduct.availableUnit === u
                                    ? 'bg-[#3DA35D] text-white'
                                    : 'text-stone-500'
                                }`}
                              >
                                {u}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-stone-400">
                          Локация
                        </label>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="flex items-center justify-between rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-800">
                            {newProduct.region}
                            <ChevronDown size={15} className="text-stone-400" />
                          </div>
                          <input
                            type="text"
                            placeholder="Город,село,поселок"
                            value={newProduct.locationText}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, locationText: e.target.value })
                            }
                            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-800 outline-none placeholder:font-normal placeholder:text-stone-400 focus:border-[#3DA35D] focus:ring-2 focus:ring-[#3DA35D]/20"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-stone-400">
                          Телефон
                        </label>
                        <div className="flex items-center gap-2 rounded-xl border border-stone-200 px-4 py-2.5">
                          <Phone size={15} className="text-[#3DA35D]" />
                          <input
                            type="tel"
                            value={newProduct.phone}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, phone: e.target.value })
                            }
                            className="w-full text-sm font-semibold text-stone-800 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-stone-400">
                          Описание
                        </label>
                        <textarea
                          rows={4}
                          value={newProduct.description}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, description: e.target.value })
                          }
                          className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-800 outline-none focus:border-[#3DA35D] focus:ring-2 focus:ring-[#3DA35D]/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Заказы ───────────────────────────────────── */}
              {tab === 'orders' && (
                <div className="flex flex-col gap-4">
                  <h1 className="text-2xl font-extrabold text-stone-900">Заказы</h1>

                  <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
                    {orderSubTabs.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setOrderSubTab(t.id)}
                        className={`rounded-full px-3.5 py-1.5 transition ${
                          orderSubTab === t.id
                            ? 'bg-[#3DA35D] text-white'
                            : 'text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3">
                    {visibleOrders.length === 0 && (
                      <div className="rounded-2xl border border-stone-100 bg-white p-6 text-center text-sm text-stone-400 shadow-sm">
                        Нет заказов в этой категории.
                      </div>
                    )}
                    {visibleOrders.map((o) => (
                      <div
                        key={o.id}
                        className="relative flex flex-wrap items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
                      >
                        <span
                          className={`absolute -top-2.5 right-4 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white ${
                            o.paid ? 'bg-[#2E7D4F]' : 'bg-red-500'
                          }`}
                        >
                          {o.paid ? 'Оплачен' : 'Не оплачен'}
                        </span>

                        <div className="h-14 w-14 shrink-0 rounded-xl bg-stone-200" />

                        <div className="min-w-[160px] flex-1">
                          <p className="font-extrabold text-[#3DA35D]">№{o.id}</p>
                          <p className="font-extrabold text-stone-900">{o.buyer}</p>
                          <p className="text-sm text-stone-500">
                            <span className="font-semibold text-stone-700">{o.product}</span>{' '}
                            {o.qty} · осталось {o.remaining}
                          </p>
                          <p className="text-xs text-stone-400">{o.date}</p>
                        </div>

                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-500">
                          {o.status === 'new'
                            ? 'Новое'
                            : o.status === 'in_progress'
                            ? 'В работе'
                            : o.status === 'done'
                            ? 'Завершен'
                            : 'Отменен'}
                        </span>

                        <p className="text-base font-extrabold text-stone-900">
                          {o.total.toLocaleString()} сом
                        </p>

                        <button className="rounded-xl bg-[#3DA35D]/10 px-4 py-1.5 text-sm font-bold text-[#2E7D4F] hover:bg-[#3DA35D]/20">
                          Открыть
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Чаты ─────────────────────────────────────── */}
              {tab === 'messages' && (() => {
                const activeChat =
                  mockMessages.find((m) => m.id === activeChatId) || mockMessages[0]
                return (
                  <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm sm:grid-cols-[240px_1fr] sm:h-[560px]">
                    {/* Conversation list */}
                    <div className="flex flex-col border-b border-stone-100 sm:border-b-0 sm:border-r">
                      <h2 className="px-4 py-4 text-sm font-extrabold text-stone-900">Чаты</h2>
                      <div className="flex flex-col overflow-y-auto">
                        {mockMessages.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setActiveChatId(m.id)}
                            className={`flex items-center gap-3 px-4 py-3 text-left transition ${
                              (activeChat?.id ?? mockMessages[0]?.id) === m.id
                                ? 'bg-[#3DA35D]/10'
                                : 'hover:bg-stone-50'
                            }`}
                          >
                            <div className="h-9 w-9 shrink-0 rounded-full bg-stone-200" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-bold text-stone-900">{m.from}</p>
                              <p className="truncate text-xs text-stone-500">{m.preview}</p>
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-1">
                              <span className="text-[11px] text-stone-400">{m.time}</span>
                              {m.unread && <span className="h-2 w-2 rounded-full bg-[#3DA35D]" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Active thread */}
                    <div className="flex min-h-[420px] flex-col sm:min-h-0">
                      <div className="flex items-center gap-3 border-b border-stone-100 px-5 py-4">
                        <div className="h-9 w-9 shrink-0 rounded-full bg-stone-200" />
                        <p className="text-sm font-bold text-stone-900">{activeChat?.from}</p>
                      </div>

                      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
                        <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-stone-100 px-4 py-2.5 text-sm text-stone-700">
                          {activeChat?.preview}
                        </div>
                        <div className="ml-auto max-w-[75%] rounded-2xl rounded-tr-sm bg-[#3DA35D] px-4 py-2.5 text-sm text-white">
                          Здравствуйте! Да, товар в наличии, могу отправить сегодня.
                        </div>
                        <div className="ml-auto max-w-[75%] rounded-2xl rounded-tr-sm bg-[#3DA35D] px-4 py-2.5 text-sm text-white">
                          Напишите удобный адрес доставки.
                        </div>
                      </div>

                      <div className="flex items-center gap-2 border-t border-stone-100 px-4 py-3">
                        <button
                          type="button"
                          className="shrink-0 rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
                          aria-label="Прикрепить файл"
                        >
                          <Paperclip size={18} />
                        </button>
                        <input
                          type="text"
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          placeholder="Написать сообщение..."
                          className="flex-1 rounded-full border border-stone-200 px-4 py-2 text-sm outline-none focus:border-[#3DA35D] focus:ring-2 focus:ring-[#3DA35D]/20"
                        />
                        <button
                          type="button"
                          onClick={() => setDraft('')}
                          className="shrink-0 rounded-full bg-[#3DA35D] p-2.5 text-white hover:opacity-90"
                          aria-label="Отправить"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* ── Профиль ──────────────────────────────────── */}
              {tab === 'settings' && (
                <div className="flex flex-col gap-6">
                  <h1 className="text-2xl font-extrabold text-stone-900">Профиль</h1>

                  {/* Profile card: avatar, name, verification */}
                  <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative">
                        <div className="h-20 w-20 rounded-full bg-stone-200" />
                        <button
                          type="button"
                          className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#E3A83F] text-white ring-2 ring-white"
                          aria-label="Изменить фото"
                        >
                          <Pencil size={11} />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center gap-1.5">
                        <h2 className="text-base font-extrabold text-stone-900">{displayName}</h2>
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2E7D4F]">
                          <Check size={10} className="text-white" strokeWidth={3} />
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-stone-400">
                        {profile?.farm_name}
                        {profile?.farm_name && profile?.region ? ' · ' : ''}
                        {profile?.region}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5 text-sm">
                        <Star size={13} className="fill-[#E3A83F] text-[#E3A83F]" />
                        <span className="font-bold text-[#E3A83F]">4.7</span>
                        <span className="text-stone-400">{myProducts.length} товаров</span>
                      </div>
                    </div>

                    <div className="my-5 border-t border-stone-100" />

                    <div>
                      <h3 className="mb-4 text-sm font-semibold text-stone-400">
                        Документы и Верификация
                      </h3>
                      <div className="flex flex-col gap-4">
                        {verificationItems.map((item) => (
                          <div key={item.label} className="flex items-center justify-between text-sm">
                            <span className="font-bold text-stone-900">{item.label}</span>
                            <span
                              className={`font-bold ${
                                item.status === 'verified' ? 'text-[#2E7D4F]' : 'text-[#C4762F]'
                              }`}
                            >
                              {item.status === 'verified' ? 'Проверен' : 'На проверке'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Settings form */}
                  <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-5 text-sm font-semibold text-stone-400">
                      Информация о хозяйстве
                    </h3>
                    <form onSubmit={handleSave} className="flex max-w-md flex-col gap-4">
                      {profile?.role === 'farmer' && (
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-stone-400">
                            Название хозяйства
                          </label>
                          <input
                            type="text"
                            placeholder="Название хозяйства"
                            value={form.farm_name || ''}
                            onChange={(e) => setForm({ ...form, farm_name: e.target.value })}
                            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-800 outline-none focus:border-[#3DA35D] focus:ring-2 focus:ring-[#3DA35D]/20"
                          />
                        </div>
                      )}

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-stone-400">
                          Номер телефона
                        </label>
                        <input
                          type="tel"
                          placeholder="+996 700 000 000"
                          value={form.phone || ''}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-800 outline-none focus:border-[#3DA35D] focus:ring-2 focus:ring-[#3DA35D]/20"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-stone-400">Почта</label>
                        <input
                          type="email"
                          placeholder="you@example.com"
                          value={form.email || ''}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-800 outline-none focus:border-[#3DA35D] focus:ring-2 focus:ring-[#3DA35D]/20"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-stone-400">Регион</label>
                        <input
                          type="text"
                          placeholder="Регион"
                          value={form.region || ''}
                          onChange={(e) => setForm({ ...form, region: e.target.value })}
                          className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-800 outline-none focus:border-[#3DA35D] focus:ring-2 focus:ring-[#3DA35D]/20"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-stone-400">
                          О хозяйстве
                        </label>
                        <textarea
                          placeholder="О себе"
                          value={form.bio || ''}
                          onChange={(e) => setForm({ ...form, bio: e.target.value })}
                          rows={3}
                          className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-800 outline-none focus:border-[#3DA35D] focus:ring-2 focus:ring-[#3DA35D]/20"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={saving}
                        className="self-start rounded-xl bg-[#3DA35D] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                      >
                        {saving ? 'Сохранение...' : 'Сохранить'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}