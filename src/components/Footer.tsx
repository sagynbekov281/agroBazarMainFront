import { useTranslation } from 'react-i18next'
import { Leaf, Phone, Mail } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  const marketplaceLinks = [
    { label: t('footer.catalog'), href: '#products' },
    { label: t('footer.farmersLink'), href: '#farmers' },
    { label: t('footer.transport'), href: '#transport' },
    { label: t('footer.priceStatsLink'), href: '#transport' },
  ]

  const sellerLinks = [
    { label: t('footer.addProduct'), href: '#sell' },
    { label: t('footer.verification'), href: '#' },
    { label: t('footer.pricing'), href: '#' },
    { label: t('footer.support'), href: '#' },
  ]

  return (
    <footer id="footer" className="mt-16 bg-stone-900 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
                <Leaf size={18} strokeWidth={2.5} />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-white">
                Agro<span className="text-amber-400">Bazar</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-400">{t('footer.tagline')}</p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">{t('footer.marketplace')}</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {marketplaceLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-stone-400 transition hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">{t('footer.sellers')}</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {sellerLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-stone-400 transition hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">{t('footer.contacts')}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-400">
              <li className="flex items-center gap-2">
                <Phone size={14} />
                +996 700 000 000
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} />
                @agrobazar.com
              </li>
              <li>{t('footer.languages')}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-stone-500">
          © {year} AgroBazar. {t('footer.rights')}
        </div>
      </div>
    </footer>
  )
}