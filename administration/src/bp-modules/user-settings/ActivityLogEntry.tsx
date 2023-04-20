import React, { ReactElement } from 'react'

import { ActivityLog } from './ActivityLog'

type ActivityLogProps = {
  entry: ActivityLog
}

const ActivityLogEntry = ({ entry }: ActivityLogProps): ReactElement => {
  const { passId, expirationDate, birthday, fullName, timestamp } = entry

  return (
    <tr>
      <td>{timestamp}</td>
      <td>{fullName}</td>
      <td>{passId}</td>
      <td>{birthday}</td>
      <td>{expirationDate}</td>
    </tr>
  )
}

export default ActivityLogEntry
