import { HTMLSelect } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'

import { Role } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { roleToText } from './UsersTable'

const RoleSelector = ({
  role,
  onChange,
  hideProjectAdmin,
}: {
  role: Role | null
  onChange: (role: Role | null) => void
  hideProjectAdmin: boolean
}): ReactElement => {
  const config = useContext(ProjectConfigContext)

  return (
    <HTMLSelect fill onChange={e => onChange((e.target.value as Role | null) ?? null)} value={role ?? ''} required>
      <option value='' disabled>
        Auswählen...
      </option>
      {hideProjectAdmin ? null : <option value={Role.ProjectAdmin}>{roleToText(Role.ProjectAdmin)}</option>}
      {hideProjectAdmin || !config.applicationFeature?.applicationUsableWithApiToken ? null : (
        <option value={Role.ExternalVerifiedApiUser}>{roleToText(Role.ExternalVerifiedApiUser)}</option>
      )}
      <option value={Role.RegionAdmin}>{roleToText(Role.RegionAdmin)}</option>
      <option value={Role.RegionManager}>{roleToText(Role.RegionManager)}</option>
    </HTMLSelect>
  )
}
export default RoleSelector
