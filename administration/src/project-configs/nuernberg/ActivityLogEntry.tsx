import React, { ReactNode } from 'react'

import { ActivityLog } from '../../bp-modules/user-settings/ActivityLog'
import { JSONCardBlueprint } from '../../cards/CardBlueprint'
import BirthdayExtension from '../../cards/extensions/BirthdayExtension'
import NuernbergPassIdExtension from '../../cards/extensions/NuernbergPassIdExtension'
import { ExtensionClass } from '../../cards/extensions/extensions'
import PlainDate from '../../util/PlainDate'

const findByExtensionClass = <T extends ExtensionClass>(
  card: JSONCardBlueprint,
  extensionClass: T
): InstanceType<T> | undefined =>
  card.extensions.find(extension => extension.name === extensionClass.name) as InstanceType<T> | undefined

// Check column names of the activityLogConfig have the same order and amount than here
const ActivityLogEntry = (logEntry: ActivityLog): ReactNode => {
  const { card, timestamp } = logEntry
  const birthdayExtension = findByExtensionClass(card, BirthdayExtension)
  const passIdExtension = findByExtensionClass(card, NuernbergPassIdExtension)

  return (
    <tr key={card.id}>
      <td>{timestamp}</td>
      <td>{card.fullName}</td>
      {passIdExtension && <td>{passIdExtension.state?.passId}</td>}
      {birthdayExtension && <td>{PlainDate.fromDaysSinceEpoch(birthdayExtension.state?.birthday ?? 0).format()}</td>}
      {card.expirationDate !== null && <td>{PlainDate.from(card.expirationDate).format()}</td>}
    </tr>
  )
}

export default ActivityLogEntry
