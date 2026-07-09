import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import lv from "./locales/lv/translation.json";
import en from "./locales/en/translation.json";




i18n
  .use(initReactI18next) // passes i18n down to react-i18next
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
    fallbackLng: "lv", // use lv if detected lng is not available
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;