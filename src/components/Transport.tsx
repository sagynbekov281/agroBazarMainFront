// src/components/Transport.tsx
import { useTranslation } from 'react-i18next'
import { Truck, PackageSearch, Container } from 'lucide-react'
import { transportOptions } from '../data/content'

const icons = {
  truck: Truck,
  van: PackageSearch,
  flatbed: Container,
}

export default function Transport() {
  const { t } = useTranslation()

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-stone-900">{t('transport.title')}</h2>

      <div className="mt-5 flex flex-col gap-3">
        {transportOptions.map((opt) => {
          const Icon = icons[opt.icon]
          return (
            <div
              key={opt.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-stone-100 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                  <Icon size={20} />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">{t(`transport.items.${opt.key}.name`)}</h3>
                  <p className="text-xs text-stone-400">
                    {t(`transport.items.${opt.key}.capacity`)} · {t(`transport.items.${opt.key}.region`)}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span className="text-sm font-extrabold text-stone-900">
                  {opt.priceIsFrom && t('transport.priceFrom')} {opt.price.toLocaleString('ru-RU')} {t('currency')}
                </span>
                <button className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 transition hover:bg-brand-200">
                  {t('transport.order')}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}