import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Menu, X, ChevronDown, User, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { t, i18n } = useTranslation()
  const { isAuthenticated, displayName, phone, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'ru' ? 'en' : 'ru')
  }

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  const navItems = [
    { label: t('header.catalog'), href: '#top' },
    { label: t('header.farmers'), href: '#farmers' },
    { label: t('header.transport'), href: '#transport' },
    { label: 'Карта', href: '#transport' },
    { label: t('header.about'), href: '#footer' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* top row */}
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img
            src="/mainIcon.svg"
            alt="AgroBazar"
            className="h-10 w-10 rounded-lg object-cover shadow-sm shadow-emerald-900/10"
          />
          <span className="text-2xl font-black tracking-[-0.06em] text-[#E3A83F] sm:text-3xl">
            Agro<span className="text-[#3DA35D]">Bazar</span>
          </span>
        </Link>

        <div className="hidden justify-center md:flex">
          <div className="relative w-full max-w-md">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder={t('header.searchPlaceholder')}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-11 pr-4 text-sm text-stone-700 placeholder:text-stone-400 outline-none transition focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <button className="hidden h-10 w-10 items-center justify-center rounded-full transition hover:bg-stone-100 sm:flex" aria-label="Notifications">
            <img src="/messang.svg" alt="" className="h-[22px] w-[22px]" />
          </button>
          <button className="hidden h-10 w-10 items-center justify-center rounded-full transition hover:bg-stone-100 sm:flex" aria-label="Messages">
            <img src="/chat.svg" alt="" className="h-[22px] w-[22px]" />
          </button>
          <button className="hidden h-10 w-10 items-center justify-center rounded-full transition hover:bg-stone-100 sm:flex" aria-label="Favorites">
            <img src="/heart.svg" alt="" className="h-[22px] w-[22px]" />
          </button>
          <button className="hidden h-10 w-10 items-center justify-center rounded-full transition hover:bg-stone-100 sm:flex" aria-label="Cart">
            <img src="/corzinka.svg" alt="" className="h-[22px] w-[22px]" />
          </button>

          <button
            onClick={toggleLang}
            className="flex h-8 items-center justify-center rounded-full border border-stone-200 px-2.5 text-xs font-bold text-stone-600 transition hover:border-brand-300 hover:text-brand-700"
            aria-label="Switch language"
          >
            {i18n.language === 'ru' ? 'RU' : 'EN'}
          </button>

          {isAuthenticated ? (
            <div className="relative hidden sm:block" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full px-2 py-1.5 transition hover:bg-stone-100"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 text-stone-500">
                  <User size={16} />
                </span>
                <span className="text-sm font-semibold text-stone-800">
                  {displayName || phone}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-stone-500 transition ${menuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-stone-100 bg-white py-1.5 shadow-lg">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
                  >
                    <User size={16} />
                    Профиль
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-full border border-stone-200 px-3.5 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 sm:inline-block"
              >
                {t('header.login')}
              </Link>
              <Link
                to="/register"
                className="hidden rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-500/25 transition hover:bg-brand-600 sm:inline-block"
              >
                {t('header.register')}
              </Link>
            </>
          )}

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
              className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-11 pr-4 text-sm outline-none"
            />
          </div>
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setOpen(false)} className="text-sm font-medium text-stone-700">
                {item.label}
              </a>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-sm font-semibold text-stone-700"
                  onClick={() => setOpen(false)}
                >
                  Профиль ({displayName || phone})
                </Link>
                <button
                  onClick={() => {
                    setOpen(false)
                    handleLogout()
                  }}
                  className="text-left text-sm font-semibold text-red-600"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-stone-700" onClick={() => setOpen(false)}>
                  {t('header.login')}
                </Link>
                <Link
                  to="/register"
                  className="mt-1 rounded-full bg-brand-500 px-4 py-2 text-center text-sm font-semibold text-white"
                  onClick={() => setOpen(false)}
                >
                  {t('header.register')}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}