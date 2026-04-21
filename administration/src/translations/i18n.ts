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
})

// i18next v26 introduced a built-in Formatter class that always overrides interpolation.format.
// We override the built-in 'datetime' format to support Temporal types.
i18n.services.formatter?.add(
  'datetime',
  (value: unknown, _lng: string | undefined, options: Record<string, unknown>) => {
    const intlOptions = parseI18nFormatToIntlOptions(options)

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
      return (
        value as { toLocaleString(locale: string, opts?: Intl.DateTimeFormatOptions): string }
      ).toLocaleString(defaultUiLocale, intlOptions)
    }
    return String(value)
  },
)

export default i18n

function parseI18nFormatToIntlOptions(
  format: string | Record<string, unknown> | undefined,
): Intl.DateTimeFormatOptions | undefined {
  if (typeof format === 'object') {
    const result: Intl.DateTimeFormatOptions = {}

    if (isDateTimeStyle(format.dateStyle as string | undefined)) {
      result.dateStyle = format.dateStyle as Intl.DateTimeFormatOptions['dateStyle']
    }
    if (isDateTimeStyle(format.timeStyle as string | undefined)) {
      result.timeStyle = format.timeStyle as Intl.DateTimeFormatOptions['timeStyle']
    }
    return result
  }

  const options =
    (format as string | undefined)?.match(datetimeParser)?.[0]?.matchAll(datetimeStyleParser) ??
    null

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
