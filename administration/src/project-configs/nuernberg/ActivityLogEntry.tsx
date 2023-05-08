import { format } from 'date-fns'
import { ReactNode } from 'react'

import { ActivityLog } from '../../bp-modules/user-settings/ActivityLog'
import { daysSinceEpochToDate } from '../../cards/validityPeriod'

// Check column names of the activityLogConfig have the same order and amount than here
export const ActivityLogEntry = (logEntry: ActivityLog): ReactNode => {
  const { card, timestamp } = logEntry
  const birthdayExtension = card.extensionHolders.find(extension => extension.state.hasOwnProperty('birthday'))
  const passNumberExtension = card.extensionHolders.find(extension => extension.state.hasOwnProperty('passNumber'))

  return (
    <tr key={card.id}>
      <td>{timestamp}</td>
      <td>{card.fullName}</td>
      {passNumberExtension && <td>{passNumberExtension.state.passNumber}</td>}
      {birthdayExtension && <td>{format(daysSinceEpochToDate(birthdayExtension.state.birthday), 'dd.MM.yyyy')}</td>}
      {card.expirationDate && <td>{format(new Date(card.expirationDate), 'dd.MM.yyyy')}</td>}
    </tr>
  )
}
