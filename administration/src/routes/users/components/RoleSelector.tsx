import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import FormAlert from '../../../components/FormAlert'
import { Role } from '../../../generated/graphql'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import roleToText from '../utils/roleToText'
import RoleHelpButton from './RoleHelpButton'

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
  const [touched, setTouched] = useState(false)
  const config = useContext(ProjectConfigContext)
  const showExternalVerifiedApiUser = config.applicationFeature?.applicationUsableWithApiToken && !hideProjectAdmin
  const showError = role === null && touched
  return (
    <>
      <Stack direction='row'>
        <FormControl fullWidth size='small' required>
          <InputLabel shrink={role !== null}>{t('selectRole')}</InputLabel>
          <Select
            notched={role !== null}
            size='small'
            label={t('selectRole')}
            value={role ?? ''}
            onBlur={() => setTouched(true)}
            onChange={e => onChange(e.target.value as Role)}>
            {hideProjectAdmin ? null : <MenuItem value={Role.ProjectAdmin}>{roleToText(Role.ProjectAdmin)}</MenuItem>}
            {showExternalVerifiedApiUser && (
              <MenuItem value={Role.ExternalVerifiedApiUser}>{roleToText(Role.ExternalVerifiedApiUser)}</MenuItem>
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
