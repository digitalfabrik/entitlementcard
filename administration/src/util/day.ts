import { addDays, differenceInDays, fromUnixTime, getUnixTime } from 'date-fns'

export const dateToDaysSinceEpoch = (date: Date): number => {
  const diff = differenceInDays(date, getUnixTime(0))
  if (diff < 0) {
    throw new Error('Can not calculate days since epoch for dates before 1970/01/01')
  }
  return diff
}

export const daysSinceEpochToDate = (day: number): Date => {
  return addDays(fromUnixTime(0), day)
}
