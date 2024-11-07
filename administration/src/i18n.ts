import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import deTranslations from './util/translations/de.json'

type Translation = typeof deTranslations

type Translations = {
  de: Translation
}

export const loadTranslations = (): Translations => ({
  de: {
    application: deTranslations.application,
  },
})

i18n.use(initReactI18next).init({
  fallbackLng: 'de',
  resources: loadTranslations(),
})

export default i18n
