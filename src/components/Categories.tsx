import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { categories } from '../data/content'

export default function Categories() {
  const { t } = useTranslation()

  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-stone-900">{t('categories.title')}</h2>
        <a href="#products" className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
          {t('categories.all')}
          <ArrowRight size={15} />
        </a>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {categories.map((c) => (
          <button
            key={c.key}
            className="group flex flex-col items-center gap-2.5 rounded-2xl border border-stone-100 bg-white px-3 py-5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
          >
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
              style={{ backgroundColor: c.tint }}
            >
              {c.emoji}
            </span>
            <span className="text-xs font-bold text-stone-800 sm:text-sm">{t(`categories.${c.key}`)}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
