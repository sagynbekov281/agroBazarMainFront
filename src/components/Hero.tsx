import { useTranslation } from 'react-i18next'
import { Check, ArrowRight } from 'lucide-react'

export default function Hero() {
  const { t } = useTranslation()

  const stats = [
    { value: '4500+', label: t('hero.stats.farmers') },
    { value: '60 000+', label: t('hero.stats.products') },
    { value: '7', label: t('hero.stats.regions') },
  ]

  return (
    <section id="top" className="relative overflow-hidden bg-white">
      {/* fading field photo, right side */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] lg:block">
        <img
          src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
            <Check size={13} strokeWidth={3} />
            {t('hero.badge')}
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-stone-900 sm:text-5xl">
            {t('hero.title')}
          </h1>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-stone-500 sm:text-base">
            {t('hero.subtitle')}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#products"
              className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-500/25 transition hover:bg-brand-600"
            >
              {t('hero.ctaPrimary')}
            </a>
            <a
              href="#sell"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-800 transition hover:border-stone-400 hover:bg-stone-50"
            >
              {t('hero.ctaSecondary')}
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="mt-10 flex items-center gap-10">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-extrabold text-stone-900 sm:text-3xl">{s.value}</div>
                <div className="mt-0.5 text-xs text-stone-500 sm:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* mobile image */}
      <div className="px-4 pb-8 lg:hidden">
        <img
          src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=900&q=80"
          alt=""
          className="h-48 w-full rounded-2xl object-cover"
        />
      </div>
    </section>
  )
}
