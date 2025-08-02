import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import fr from './locales/fr/translation.json';
import hi from './locales/hi/translation.json';
import es from './locales/es/translation.json';
import pt from './locales/pt/translation.json';
import zh from './locales/zh/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    hi: { translation: hi },
    es: { translation: es },
    pt: { translation: pt },
    zh: { translation: zh },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
