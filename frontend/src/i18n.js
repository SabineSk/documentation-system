import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import lv from "./locales/lv/translation.json";
import en from "./locales/en/translation.json";




i18n
  .use(initReactI18next)
  .init({
    resources: {
      lv: {
        translation: lv
      },
      en: {
        translation: en
      }
    },
    lng: "lv", // default language
    fallbackLng: "lv", 
    interpolation: {
      escapeValue: false 
    }
  });

  export default i18n;