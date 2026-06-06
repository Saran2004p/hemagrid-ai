import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import hi from './locales/hi.json'
import ta from './locales/ta.json'
import te from './locales/te.json'
import bn from './locales/bn.json'
import mr from './locales/mr.json'
import gu from './locales/gu.json'
import kn from './locales/kn.json'
import ml from './locales/ml.json'
import pa from './locales/pa.json'
import or from './locales/or.json'

// ✅ BUG-01 FIX: Save and restore language from localStorage
const STORAGE_KEY = 'bb_language'

const savedLang = localStorage.getItem(STORAGE_KEY) || 'en'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ta: { translation: ta },
      te: { translation: te },
      bn: { translation: bn },
      mr: { translation: mr },
      gu: { translation: gu },
      kn: { translation: kn },
      ml: { translation: ml },
      pa: { translation: pa },
      or: { translation: or },
    },
    lng:          savedLang,
    fallbackLng:  'en',
    interpolation:{ escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: STORAGE_KEY,
    }
  })

// ✅ Save language on every change
i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng)
})

export default i18n
