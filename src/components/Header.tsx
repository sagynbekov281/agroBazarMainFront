import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Leaf, Search, Bell, MessageCircle, Heart, Menu, X } from 'lucide-react'

export default function Header() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'ru' ? 'en' : 'ru')
  }

  const navItems = [
    { label: t('header.catalog'), href: '#top' },
    { label: t('header.farmers'), href: '#farmers' },
    { label: t('header.transport'), href: '#transport' },
    { label: t('header.prices'), href: '#transport' },
    { label: t('header.about'), href: '#footer' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* top row */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <a href="#top" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <Leaf size={16} strokeWidth={2.5} />
          </span>
          <span className="text-base font-extrabold tracking-tight text-stone-900 sm:text-lg">
            Agro<span className="text-brand-500">Bazar</span>
          </span>
        </a>

        <div className="relative hidden flex-1 md:block">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder={t('header.searchPlaceholder')}
            className="w-full rounded-full border border-stone-200 bg-stone-50 py-2.5 pl-11 pr-4 text-sm text-stone-700 placeholder:text-stone-400 outline-none transition focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button className="hidden h-9 w-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 sm:flex" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <button className="hidden h-9 w-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 sm:flex" aria-label="Messages">
            <MessageCircle size={18} />
          </button>
          <button className="hidden h-9 w-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 sm:flex" aria-label="Favorites">
            <Heart size={18} />
          </button>

          <button
            onClick={toggleLang}
            className="flex h-8 items-center justify-center rounded-full border border-stone-200 px-2.5 text-xs font-bold text-stone-600 transition hover:border-brand-300 hover:text-brand-700"
            aria-label="Switch language"
          >
            {i18n.language === 'ru' ? 'RU' : 'EN'}
          </button>

          <a
            href="#login"
            className="hidden rounded-full px-3.5 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 sm:inline-block"
          >
            {t('header.login')}
          </a>
          <a
            href="#sell"
            className="hidden rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-500/25 transition hover:bg-brand-600 sm:inline-block"
          >
            {t('header.register')}
          </a>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-stone-700 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* secondary nav row */}
      <div className="hidden border-t border-stone-100 md:block">
        <nav className="mx-auto flex max-w-7xl items-center gap-7 px-4 py-2.5 sm:px-6 lg:px-8">
          {navItems.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              className={`text-sm transition ${
                i === 0 ? 'font-bold text-stone-900' : 'font-medium text-stone-500 hover:text-brand-700'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {open && (
        <div className="border-t border-stone-100 bg-white px-4 py-3 md:hidden">
          <div className="relative mb-3">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder={t('header.searchPlaceholder')}
              className="w-full rounded-full border border-stone-200 bg-stone-50 py-2.5 pl-11 pr-4 text-sm outline-none"
            />
          </div>
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setOpen(false)} className="text-sm font-medium text-stone-700">
                {item.label}
              </a>
            ))}
            <a href="#login" className="text-sm font-semibold text-stone-700">
              {t('header.login')}
            </a>
            <a href="#sell" className="mt-1 rounded-full bg-brand-500 px-4 py-2 text-center text-sm font-semibold text-white">
              {t('header.register')}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
