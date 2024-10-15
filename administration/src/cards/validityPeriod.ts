import { addDays, differenceInDays, fromUnixTime, getUnixTime } from 'date-fns'

export const dateToDaysSinceEpoch = (date: Date): number => differenceInDays(date, getUnixTime(0))

export const daysSinceEpochToDate = (day: number): Date => addDays(fromUnixTime(0), day)
