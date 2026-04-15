import { Temporal } from 'temporal-polyfill'

export const defaultStatisticsRange = {
  // Subtract a year from now and add a day to have exactly one year, since the end date is included
  // in the time period. this approach also considers leap years.
  start: Temporal.Now.plainDateISO().subtract({ years: 1 }).add({ days: 1 }),
  end: Temporal.Now.plainDateISO(),
}

export type StatisticsRange = {
  start: Temporal.PlainDate
  end: Temporal.PlainDate
}
