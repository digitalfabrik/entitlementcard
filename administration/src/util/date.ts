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

export function safeFromLocalDate(date: Date | null): Temporal.PlainDate | null {
  if (date === null || Number.isNaN(date.getTime())) {
    return null
  }
  try {
    return plainDateFromLegacyDate(date)
  } catch {
    return null
  }
}

export function safeParseGermanPlainDateString(
  dateString: string | null,
): Temporal.PlainDate | null {
  if (dateString === null) {
    return null
  }
  try {
    return parseGermanPlainDateString(dateString)
  } catch {
    return null
  }
}

export function safeParseISOPlainDate(isoString: string | null): Temporal.PlainDate | null {
  if (isoString === null) {
    return null
  }
  try {
    return Temporal.PlainDate.from(isoString)
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

export const dateFormatterDateDefaultGerman = new Intl.DateTimeFormat('de-DE', {
  dateStyle: 'medium',
})

export function formatDateDefaultGerman(date: Temporal.PlainDate): string {
  return dateFormatterDateDefaultGerman.format(date)
}
