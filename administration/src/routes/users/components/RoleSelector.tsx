import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React, { ReactElement, useContext, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'

import FormAlert from '../../../components/FormAlert'
import { Role } from '../../../generated/graphql'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import { useWhoAmI } from '../../../provider/WhoAmIProvider'
import roleToText from '../utils/roleToText'
import RoleHelpButton from './RoleHelpButton'

const RoleSelector = ({
  selectedRole,
  onChange,
}: {
  selectedRole: Role | null
  onChange: (role: Role | null) => void
}): ReactElement => {
  const { t } = useTranslation('users')
  const { role: activeRole } = useWhoAmI().me
  const [touched, setTouched] = useState(false)
  const config = useContext(ProjectConfigContext)
  const isProjectAdmin = activeRole === Role.ProjectAdmin
  const showExternalVerifiedApiUser =
    config.applicationFeature?.applicationUsableWithApiToken && isProjectAdmin
  const showProjectStoreManager = config.storesManagement.enabled && isProjectAdmin
  const showError = selectedRole === null && touched
  const labelId = useId()
  return (
    <>
      <Stack direction='row'>
        <FormControl fullWidth size='small' required>
          <InputLabel shrink={selectedRole !== null} id={labelId}>
            {t('selectRole')}
          </InputLabel>
          <Select
            notched={selectedRole !== null}
            size='small'
            label={t('selectRole')}
            labelId={labelId}
            value={selectedRole ?? ''}
            onBlur={() => setTouched(true)}
            onChange={e => onChange(e.target.value as Role)}
          >
            {isProjectAdmin && (
              <MenuItem value={Role.ProjectAdmin}>{roleToText(Role.ProjectAdmin)}</MenuItem>
            )}
            {showProjectStoreManager && (
              <MenuItem value={Role.ProjectStoreManager}>
                {roleToText(Role.ProjectStoreManager)}
              </MenuItem>
            )}
            {showExternalVerifiedApiUser && (
              <MenuItem value={Role.ExternalVerifiedApiUser}>
                {roleToText(Role.ExternalVerifiedApiUser)}
              </MenuItem>
            )}
            <MenuItem value={Role.RegionAdmin}>{roleToText(Role.RegionAdmin)}</MenuItem>
            <MenuItem value={Role.RegionManager}>{roleToText(Role.RegionManager)}</MenuItem>
          </Select>
        </FormControl>
        <RoleHelpButton />
      </Stack>
      <Box sx={{ marginTop: -2 }}>{showError && <FormAlert errorMessage={t('noRoleError')} />}</Box>
    </>
  )
}
export default RoleSelector
