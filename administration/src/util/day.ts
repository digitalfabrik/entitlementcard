import {fromUnixTime, getUnixTime } from "date-fns"
const DAY_IN_SECONDS = 60 * 60 * 24;

export const dateToDaysSinceEpoch = (date: Date): number => {
    return Math.floor(getUnixTime(date) / DAY_IN_SECONDS)
}

export const daysSinceEpochToDate = (day: number): Date => {
    if (day > Number.MAX_SAFE_INTEGER / DAY_IN_SECONDS) {
        throw Error("Date overflow")
    }

    return fromUnixTime(day * DAY_IN_SECONDS)
}
