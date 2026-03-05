import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { BIRTHDAY_EXTENSION_NAME } from '../../cards/extensions/BirthdayExtension'
import { NUERNBERG_PASS_ID_EXTENSION_NAME } from '../../cards/extensions/NuernbergPassIdExtension'
import { ActivityLogEntryType } from '../../routes/activity-log/utils/activityLog'
import { formatDateDefaultGerman } from '../../util/date'

// Check column names of the activityLogConfig have the same order and amount than here
const ActivityLogEntry = ({ logEntry }: { logEntry: ActivityLogEntryType }): ReactElement => {
  const { t } = useTranslation('activityLog')
  const birthdayExtension = logEntry.card.extensions[BIRTHDAY_EXTENSION_NAME] ?? null
  const passIdExtension = logEntry.card.extensions[NUERNBERG_PASS_ID_EXTENSION_NAME] ?? null

  return (
    <tr>
      <td>{t('date', { date: logEntry.timestamp })}</td>
      <td>{logEntry.card.fullName}</td>
      {passIdExtension !== null && <td>{passIdExtension}</td>}
      {birthdayExtension !== null && <td>{formatDateDefaultGerman(birthdayExtension)}</td>}
      {logEntry.card.expirationDate !== null && (
        <td>{formatDateDefaultGerman(logEntry.card.expirationDate)}</td>
      )}
    </tr>
  )
}

export default ActivityLogEntry
