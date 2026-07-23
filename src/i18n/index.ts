import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from './locales/ru.json'
import en from './locales/en.json'

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('agrobazar-lang') : null

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: savedLang || 'ru',
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('agrobazar-lang', lng)
    document.documentElement.lang = lng
  }
})

export default i18n
