import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import deTranslations from './util/translations/de.json'

export const loadTranslations = () => {
  return {
    de: { application: deTranslations.application }
  }
}

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'de',
    resources: loadTranslations()
  })

export default i18n