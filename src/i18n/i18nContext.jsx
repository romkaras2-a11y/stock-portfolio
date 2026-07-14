import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Hier werden deine bereits erstellten JSON-Dateien importiert
import translationDE from './locales/de.json';
import translationEN from './locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      de: { translation: translationDE },
      en: { translation: translationEN }
    },
    lng: 'de', // Startsprache
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false // React schützt bereits vor XSS
    }
  });

export default i18n;

