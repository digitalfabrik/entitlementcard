import { Temporal } from 'temporal-polyfill'

import type { Card, SerializedCard } from '../../../cards/card'
import { deserializeCard, serializeCard } from '../../../cards/card'
import type { CardConfig } from '../../../project-configs'

export const STORAGE_KEY = 'activity-log'

type JsonActivityLogEntry = { timestamp: string; card: SerializedCard }

export type ActivityLogEntryType = {
  timestamp: Temporal.Instant
  card: Card
}

const getActivityLog = (): JsonActivityLogEntry[] =>
  JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]')

export const loadActivityLog = (cardConfig: CardConfig): ActivityLogEntryType[] =>
  getActivityLog().map(entry => ({
    timestamp: Temporal.Instant.from(entry.timestamp),
    card: deserializeCard(entry.card, cardConfig),
  }))

export const saveActivityLog = (card: Card): void => {
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([
      ...getActivityLog(),
      {
        timestamp: Temporal.Now.instant().toString({ fractionalSecondDigits: 0 }),
        card: serializeCard(card),
      },
    ]),
  )
}

export const clearActivityLog = (): void => sessionStorage.removeItem(STORAGE_KEY)
