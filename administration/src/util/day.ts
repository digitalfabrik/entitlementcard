import {addDays, differenceInDays, fromUnixTime, getUnixTime } from "date-fns"

export const dateToDaysSinceEpoch = (date: Date): number => {
    return differenceInDays(date, getUnixTime(0))
}

export const daysSinceEpochToDate = (day: number): Date => {
    return addDays(fromUnixTime(0), day)
}
