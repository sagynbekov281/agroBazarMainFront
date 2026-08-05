// src/components/Farmers.tsx
import { useTranslation } from 'react-i18next'
import { Star, User } from 'lucide-react'
import { farmers } from '../data/content'

export default function Farmers() {
  const { t } = useTranslation()

  return (
    <section id="farmers" className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-extrabold text-stone-900">{t('farmers.title')}</h2>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {farmers.map((f) => {
          const goodRating = f.rating >= 4.5
          return (
            <div
              key={f.id}
              className="flex flex-col rounded-2xl border border-stone-100 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative w-fit">
                {f.avatar ? (
                  <img src={f.avatar} alt={t(`farmers.people.${f.key}.name`)} className="h-14 w-14 rounded-full object-cover" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-200">
                    <User size={22} className="text-stone-400" />
                  </div>
                )}
                {f.verified && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow ring-1 ring-stone-100">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                  </span>
                )}
              </div>

              <h3 className="mt-3 text-sm font-bold text-stone-900">{t(`farmers.people.${f.key}.name`)}</h3>
              <p className="mt-0.5 truncate text-xs text-stone-400">
                {t(`farmers.people.${f.key}.specialty`)} · {t(`farmers.people.${f.key}.location`)}
              </p>

              <div className="mt-2 flex items-center gap-1.5 text-xs">
                <span className={`flex items-center gap-0.5 font-bold ${goodRating ? 'text-brand-600' : 'text-amber-500'}`}>
                  <Star size={12} className={goodRating ? 'fill-brand-600' : 'fill-amber-500'} />
                  {f.rating.toFixed(1)}
                </span>
                <span className="text-stone-400">
                  {f.productsCount} {t('farmers.products')}
                </span>
              </div>

              <button className="mt-3 w-full rounded-xl border border-stone-200 py-1.5 text-xs font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-brand-50">
                {t('farmers.profile')}
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}