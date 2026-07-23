import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Heart, Crown, Leaf } from 'lucide-react'
import { products } from '../data/content'

type Tab = 'all' | 'popular' | 'new' | 'cheap'

export default function Products() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>('popular')
  const [liked, setLiked] = useState<Record<string, boolean>>({})

  const tabs: Tab[] = ['all', 'popular', 'new', 'cheap']
  const filtered = products.filter((p) => (tab === 'all' ? true : p.tags.includes(tab)))
  const toggleLike = (id: string) => setLiked((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <section id="products" className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-extrabold text-stone-900">{t('products.title')}</h2>
        <div className="flex flex-wrap gap-1">
          {tabs.map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                tab === tabKey ? 'bg-brand-500 text-white' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              {t(`products.tabs.${tabKey}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="group overflow-hidden rounded-2xl border border-stone-100 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-stone-50">
              <img
                src={p.image}
                alt={t(`products.items.${p.key}.name`)}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                loading="lazy"
              />

              {p.badge === 'vip' && (
                <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-amber-950">
                  <Crown size={11} />
                  {t('products.badgeVip')}
                </span>
              )}
              {p.badge === 'organic' && (
                <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  <Leaf size={11} />
                  {t('products.badgeOrganic')}
                </span>
              )}

              <button
                onClick={() => toggleLike(p.id)}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-stone-400 shadow-sm transition hover:text-rose-500"
                aria-label="Like"
              >
                <Heart size={14} fill={liked[p.id] ? '#f43f5e' : 'none'} color={liked[p.id] ? '#f43f5e' : 'currentColor'} />
              </button>
            </div>

            <div className="p-3 sm:p-4">
              <h3 className="text-sm font-bold text-stone-900 sm:text-base">{t(`products.items.${p.key}.name`)}</h3>
              <p className="mt-0.5 truncate text-xs text-stone-400">
                {p.seller} · {p.region}
              </p>

              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-base font-extrabold text-stone-900 sm:text-lg">{p.price}</span>
                <span className="text-xs font-medium text-stone-400">{t('products.perKg')}</span>
              </div>
              <p className="mt-0.5 text-xs text-stone-400">{t('products.minOrder', { count: p.minOrder })}</p>

              <button className="mt-3 w-full rounded-xl bg-brand-500 py-2 text-xs font-semibold text-white transition hover:bg-brand-600 sm:text-sm">
                {t('products.addToCart')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
