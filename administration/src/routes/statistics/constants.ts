import { Temporal } from 'temporal-polyfill'

// subtract a year from now and add a day to have exactly one year, since the end date is included
// in the time period. this approach also considers leap years.
export const defaultStartDate = Temporal.Now.plainDateISO().subtract({ years: 1 }).add({ days: 1 })
export const defaultEndDate = Temporal.Now.plainDateISO()
