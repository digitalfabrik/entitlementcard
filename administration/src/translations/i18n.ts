/* eslint-disable no-else-return */

/* eslint-disable prefer-arrow/prefer-arrow-functions */

/* eslint-disable @typescript-eslint/no-use-before-define */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { Temporal } from 'temporal-polyfill'

import deTranslations from './de.json'

type Translation = typeof deTranslations

type Translations = {
  de: Translation
}

export const loadTranslations = (): Translations => ({
  de: {
    activation: deTranslations.activation,
    activityLog: deTranslations.activityLog,
    application: deTranslations.application,
    applicationsOverview: deTranslations.applicationsOverview,
    applicationForms: deTranslations.applicationForms,
    applicationVerification: deTranslations.applicationVerification,
    applicationApplicant: deTranslations.applicationApplicant,
    applicationStatusNote: deTranslations.applicationStatusNote,
    auth: deTranslations.auth,
    cards: deTranslations.cards,
    extensions: deTranslations.extensions,
    errors: deTranslations.errors,
    errorTemplates: deTranslations.errorTemplates,
    misc: deTranslations.misc,
    home: deTranslations.home,
    projectSettings: deTranslations.projectSettings,
    regionSettings: deTranslations.regionSettings,
    selfService: deTranslations.selfService,
    statistics: deTranslations.statistics,
    stores: deTranslations.stores,
    storeForm: deTranslations.storeForm,
    userSettings: deTranslations.userSettings,
    users: deTranslations.users,
    shared: deTranslations.shared,
  },
})

const datetimeParser = /datetime\((.*)\)/
const datetimeStyleParser = /(dateStyle|timeStyle):\s*'([^']+)'/g

// TODO Remove this when this app should adapt to the users locale
export const defaultUiLocale = 'de-DE'

i18n.use(initReactI18next).init({
  fallbackLng: 'de',
  resources: loadTranslations(),
  interpolation: {
    // Enable interpolation of Temporal types
    format: (value, format) => {
      if (value instanceof Temporal.Duration) {
        return value.toLocaleString(defaultUiLocale)
      } else if (
        value instanceof Temporal.PlainMonthDay ||
        value instanceof Temporal.PlainYearMonth ||
        value instanceof Temporal.Instant ||
        value instanceof Temporal.PlainDate ||
        value instanceof Temporal.PlainDateTime ||
        value instanceof Temporal.ZonedDateTime ||
        value instanceof Date
      ) {
        return value.toLocaleString(defaultUiLocale, parseI18nFormatToIntlOptions(format))
      } else {
        return value
      }
    },
  },
})

export default i18n

function parseI18nFormatToIntlOptions(
  format: string | undefined,
): Intl.DateTimeFormatOptions | undefined {
  const options = format?.match(datetimeParser)?.[0]?.matchAll(datetimeStyleParser) ?? null

  if (options) {
    return options.reduce((acc, match) => {
      const [_, key, value] = match

      if (isDateTimeStyle(value)) {
        switch (key) {
          case 'dateStyle':
            acc.dateStyle = value
            break
          case 'timeStyle':
            acc.timeStyle = value
            break
        }
      }

      return acc
    }, {} as Intl.DateTimeFormatOptions)
  }
}

function isDateTimeStyle(
  style: string | undefined,
): style is Intl.DateTimeFormatOptions['dateStyle'] {
  return (
    style === 'full' ||
    style === 'long' ||
    style === 'medium' ||
    style === 'short' ||
    style === undefined
  )
}
