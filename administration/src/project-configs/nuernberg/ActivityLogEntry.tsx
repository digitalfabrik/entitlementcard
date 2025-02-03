import React, { ReactElement } from 'react'

import { ActivityLogEntryType } from '../../bp-modules/user-settings/ActivityLog'
import { BIRTHDAY_EXTENSION_NAME } from '../../cards/extensions/BirthdayExtension'
import { NUERNBERG_PASS_ID_EXTENSION_NAME } from '../../cards/extensions/NuernbergPassIdExtension'

// Check column names of the activityLogConfig have the same order and amount than here
const ActivityLogEntry = (logEntry: ActivityLogEntryType): ReactElement => {
  const { card, timestamp } = logEntry
  const birthdayExtension = card.extensions[BIRTHDAY_EXTENSION_NAME] ?? null
  const passIdExtension = card.extensions[NUERNBERG_PASS_ID_EXTENSION_NAME] ?? null

  return (
    <tr key={card.id}>
      <td data-testid='activity-log-entry-timestamp'>{timestamp.toLocaleString()}</td>
      <td data-testid='activity-log-entry-fullname'>{card.fullName}</td>
      {passIdExtension !== null && <td data-testid='activity-log-entry-pass-id'>{passIdExtension}</td>}
      {birthdayExtension !== null && <td data-testid='activity-log-entry-birthday'>{birthdayExtension.format()}</td>}
      {card.expirationDate !== null && <td data-testid='activity-log-entry-expiry'>{card.expirationDate.format()}</td>}
    </tr>
  )
}

export default ActivityLogEntry
