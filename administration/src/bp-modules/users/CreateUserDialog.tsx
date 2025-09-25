import { Checkbox, FormGroup, InputGroup } from '@blueprintjs/core'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { Stack } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { Role, useCreateAdministratorMutation } from '../../generated/graphql'
import ConfirmDialog from '../../mui-modules/application/ConfirmDialog'
import { useAppToaster } from '../AppToaster'
import RegionSelector from './RegionSelector'
import RoleHelpButton from './RoleHelpButton'
import RoleSelector from './RoleSelector'

const RoleFormGroupLabel = styled.span`
  & span {
    display: inline-block !important;
  }
`

const CreateUserDialog = ({
  isOpen,
  onClose,
  onSuccess,
  regionIdOverride,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  // If regionIdOverride is set, the region selector will be hidden, and only RegionAdministrator and RegionManager
  // roles are selectable.
  regionIdOverride: number | null
}): ReactElement => {
  const appToaster = useAppToaster()
  const { t } = useTranslation('users')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role | null>(null)
  const [regionId, setRegionId] = useState<number | null>(null)
  const [sendWelcomeMail, setSendWelcomeMail] = useState(true)
  const rolesWithRegion = [Role.RegionManager, Role.RegionAdmin]

  const clearAndCloseDialog = () => {
    setEmail('')
    setRole(null)
    setRegionId(null)
    setSendWelcomeMail(true)
    onClose()
  }

  const [createAdministrator, { loading }] = useCreateAdministratorMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
    onCompleted: () => {
      appToaster?.show({ intent: 'success', message: t('addUserSuccess') })
      onSuccess()
      clearAndCloseDialog()
    },
  })

  const getRegionId = () => {
    if (regionIdOverride !== null) {
      return regionIdOverride
    }
    return role !== null && rolesWithRegion.includes(role) ? regionId : null
  }

  return (
    <ConfirmDialog
      open={isOpen}
      title={t('addUser')}
      loading={loading}
      id='add-user-dialog'
      onClose={clearAndCloseDialog}
      confirmButtonText={t('addUser')}
      confirmButtonIcon={<AddCircleOutlineIcon />}
      onConfirm={() =>
        createAdministrator({
          variables: {
            email,
            role: role as Role,
            regionId: getRegionId(),
            sendWelcomeMail,
          },
        })
      }>
      <Stack>
        <FormGroup label={t('createUserEmailLabel')}>
          <InputGroup
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
            type='email'
            placeholder='erika.musterfrau@example.org'
          />
        </FormGroup>
        <FormGroup
          label={
            <RoleFormGroupLabel>
              {t('role')} <RoleHelpButton />
            </RoleFormGroupLabel>
          }>
          <RoleSelector role={role} onChange={setRole} hideProjectAdmin={regionIdOverride !== null} />
        </FormGroup>
        {regionIdOverride !== null || role === null || !rolesWithRegion.includes(role) ? null : (
          <FormGroup label={t('region')}>
            <RegionSelector onSelect={region => setRegionId(region.id)} selectedId={regionId} />
          </FormGroup>
        )}
        <FormGroup>
          <Checkbox checked={sendWelcomeMail} onChange={e => setSendWelcomeMail(e.currentTarget.checked)}>
            <b>{t('sendWelcomeMail')}</b>
            <br />
            {t('sendWelcomeMailExplanation')}
          </Checkbox>
        </FormGroup>
      </Stack>
    </ConfirmDialog>
  )
}

export default CreateUserDialog
