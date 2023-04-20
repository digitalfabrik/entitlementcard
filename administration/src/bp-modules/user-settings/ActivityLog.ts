import { format } from 'date-fns'

import { daysSinceEpochToDate } from '../../cards/validityPeriod'

const STORAGE_KEY = 'activity-log'

export class ActivityLog {
  passId: string
  birthday: string
  timestamp: string
  fullName: string
  expirationDate: string

  constructor(fullName: string, birthday: number, passId: number, expirationDate: Date) {
    this.fullName = fullName
    this.birthday = format(daysSinceEpochToDate(birthday), 'dd.MM.yyyy')
    this.passId = passId.toString()
    this.expirationDate = format(expirationDate, 'dd.MM.yyyy')
    this.timestamp = format(Date.now(), 'dd.MM.yyyy kk:mm:ss')
  }
  saveToSessionStorage = () => {
    const logEntries = loadActivityLog()
    logEntries.push(this)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(logEntries))
  }
}

export const loadActivityLog = (): ActivityLog[] => JSON.parse(sessionStorage.getItem(STORAGE_KEY)!) || []
