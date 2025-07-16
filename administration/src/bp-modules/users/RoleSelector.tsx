import { HTMLSelect } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { Role } from '../../generated/graphql'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import roleToText from './utils/roleToText'

const RoleSelector = ({
  role,
  onChange,
  hideProjectAdmin,
}: {
  role: Role | null
  onChange: (role: Role | null) => void
  hideProjectAdmin: boolean
}): ReactElement => {
  const { t } = useTranslation('users')
  const config = useContext(ProjectConfigContext)

  return (
    <HTMLSelect fill onChange={e => onChange((e.target.value as Role | null) ?? null)} value={role ?? ''} required>
      <option value='' disabled>
        {t('select')}
      </option>
      {hideProjectAdmin ? null : <option value={Role.ProjectAdmin}>{roleToText(Role.ProjectAdmin)}</option>}
      <RenderGuard
        allowedRoles={[Role.ProjectAdmin]}
        condition={config.applicationFeature?.applicationUsableWithApiToken}>
        <option value={Role.ExternalVerifiedApiUser}>{roleToText(Role.ExternalVerifiedApiUser)}</option>
      </RenderGuard>
      <option value={Role.RegionAdmin}>{roleToText(Role.RegionAdmin)}</option>
      <option value={Role.RegionManager}>{roleToText(Role.RegionManager)}</option>
    </HTMLSelect>
  )
}
export default RoleSelector
