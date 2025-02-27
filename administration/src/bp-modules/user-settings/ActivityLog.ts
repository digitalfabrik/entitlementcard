import { formatISO, parseISO } from 'date-fns'

import { deserializeCard, serializeCard } from '../../cards/Card'
import type { Card, SerializedCard } from '../../cards/Card'
import type { CardConfig } from '../../project-configs/getProjectConfig'

export const STORAGE_KEY = 'activity-log'

type JsonActivityLogEntry = { timestamp: string; card: SerializedCard }

export type ActivityLogEntryType = {
  timestamp: Date
  card: Card
}

const getActivityLog = (): JsonActivityLogEntry[] => JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]')

export const loadActivityLog = (cardConfig: CardConfig): ActivityLogEntryType[] =>
  getActivityLog().map(entry => ({
    card: deserializeCard(entry.card, cardConfig),
    timestamp: parseISO(entry.timestamp),
  }))

export const saveActivityLog = (card: Card): void => {
  const logEntries = getActivityLog()
  const jsonLogEntry: JsonActivityLogEntry = {
    timestamp: formatISO(Date.now()),
    card: serializeCard(card),
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...logEntries, jsonLogEntry]))
}
