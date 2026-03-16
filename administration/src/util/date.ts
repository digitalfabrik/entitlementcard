/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Intl, Temporal } from 'temporal-polyfill'

export function parseGermanPlainDateString(dateString: string): Temporal.PlainDate {
  const [day, month, year] = dateString.split('.')
  return new Temporal.PlainDate(parseInt(year, 10), parseInt(month, 10), parseInt(day, 10))
}

export function plainDateFromLegacyDate(date: Date): Temporal.PlainDate {
  return new Temporal.PlainDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

export function plainDateToLegacyDate(date: Temporal.PlainDate): Date {
  const jsDate = new Date(date.year, date.month - 1, date.day)
  // We need to setFullYear, as the Date constructor adds 1900 years if year is between 0 and 99 inclusive.
  jsDate.setFullYear(date.year)
  return jsDate
}

export function safeParseGermanPlainDateString(
  dateString: string | null,
): Temporal.PlainDate | null {
  try {
    return dateString != null ? parseGermanPlainDateString(dateString) : null
  } catch {
    return null
  }
}

export function safeParseIsoPlainDate(isoString: string | null): Temporal.PlainDate | null {
  try {
    return isoString != null ? Temporal.PlainDate.from(isoString) : null
  } catch {
    return null
  }
}

export function plainDateFromDaysSinceEpoch(days: number): Temporal.PlainDate {
  return Temporal.PlainDate.from('1970-01-01').add({ days })
}

export function plainDateToDaysSinceEpoch(date: Temporal.PlainDate): number {
  return date.since('1970-01-01', { largestUnit: 'days' }).days
}

/**
 * A default formatter for formatting dates in German.
 *
 * Usually, this object should _not_ be used for user facing strings, instead use the string
 * translation and formatting facilities of i18next.
 */
export const dateFormatterDateDefaultGerman = new Intl.DateTimeFormat('de-DE', {
  dateStyle: 'medium',
})

/**
 * A default formatter function for formatting dates in German.
 *
 * Usually, this object should _not_ be used for user facing strings, instead use the string
 * translation and formatting facilities of i18next.
 */
export function formatDateDefaultGerman(date: Temporal.PlainDate): string {
  return dateFormatterDateDefaultGerman.format(date)
}
