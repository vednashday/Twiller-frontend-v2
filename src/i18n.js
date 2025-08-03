import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import fr from './locales/fr/translation.json';
import hi from './locales/hi/translation.json';
import es from './locales/es/translation.json';
import pt from './locales/pt/translation.json';
import zh from './locales/zh/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      hi: { translation: hi },
      es: { translation: es },
      pt: { translation: pt },
      zh: { translation: zh },
    },
    // The language to use if no language is detected
    fallbackLng: 'en',
    
    // Configuration for the LanguageDetector
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      checkWhitelist: true,
    },
    
    // This tells i18n where to save the language
    // 'i18n.changeLanguage' will set this value.
    // 'localStorage' is a good choice for browser persistence.
    // You must have 'i18next-browser-languagedetector' installed and imported.
    saveMissing: true, 

    interpolation: { 
        escapeValue: false // react already safes from xss
    },
  });

export default i18n;
