import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import translationEN from './locales/en/translation.json';
import translationZH from './locales/zh/translation.json';
import translationAR from './locales/ar/translation.json';

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  zh: {
    translation: translationZH
  },
  ar: {
    translation: translationAR
  }
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    },
    react: {
      useSuspense: true,
    }
  });

export default i18n; 