import { useTranslation } from 'react-i18next'
import { priceStats } from '../data/content'

export default function PriceStats() {
  const { t } = useTranslation()

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-stone-900">{t('priceStats.title')}</h2>

      <div className="mt-5 flex flex-col gap-2.5">
        {priceStats.map((s) => {
          const positive = s.change >= 0
          return (
            <div
              key={s.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-stone-100 bg-white px-4 py-3.5"
            >
              <span className="text-sm font-bold text-stone-900">{t(`priceStats.items.${s.key}`)}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-stone-500">
                  {s.price} {t('products.perKg')}
                </span>
                <span className={`text-sm font-bold ${positive ? 'text-brand-600' : 'text-rose-500'}`}>
                  {positive ? '+' : ''}
                  {s.change}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}