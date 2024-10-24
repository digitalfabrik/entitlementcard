import { format } from 'date-fns'

import { Card } from '../../cards/Card'

const STORAGE_KEY = 'activity-log'

export const loadActivityLog = (): ActivityLog[] => JSON.parse(sessionStorage.getItem(STORAGE_KEY)!) ?? []

export class ActivityLog {
  card: Card
  timestamp: string

  constructor(card: Card) {
    this.card = card
    this.timestamp = format(Date.now(), 'dd.MM.yyyy kk:mm:ss')
  }

  saveToSessionStorage = (): void => {
    const logEntries = loadActivityLog()
    logEntries.push(this)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(logEntries))
  }
}
