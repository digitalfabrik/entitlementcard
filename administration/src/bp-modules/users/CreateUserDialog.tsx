import { FormGroup } from '@blueprintjs/core'
import { PersonAdd } from '@mui/icons-material'
import { Stack } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppSnackbar } from '../../AppSnackbar'
import CardTextField from '../../cards/extensions/components/CardTextField'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { Role, useCreateAdministratorMutation } from '../../generated/graphql'
import ConfirmDialog from '../../mui-modules/application/ConfirmDialog'
import BaseCheckbox from '../../mui-modules/base/BaseCheckbox'
import { isEmailValid } from '../../shared/verifications'
import RegionSelector from './RegionSelector'
import RoleSelector from './RoleSelector'

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
  const appSnackbar = useAppSnackbar()
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
      appSnackbar.enqueueError(title)
    },
    onCompleted: () => {
      appSnackbar.enqueueSuccess(t('addUserSuccess'))
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

  const showRegionSelector = regionIdOverride === null && role !== null && rolesWithRegion.includes(role)
  const userCreationDisabled = !email || role === null || (showRegionSelector && regionId === null)
  return (
    <ConfirmDialog
      open={isOpen}
      title={t('addUser')}
      loading={loading}
      id='add-user-dialog'
      actionDisabled={userCreationDisabled}
      onClose={clearAndCloseDialog}
      confirmButtonText={t('addUser')}
      confirmButtonIcon={<PersonAdd />}
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
      <Stack sx={{ paddingY: 1, gap: 2 }}>
        <CardTextField
          id='create-user-name-input'
          label={t('createUserEmailLabel')}
          placeholder='erika.musterfrau@example.org'
          value={email}
          onChange={value => setEmail(value)}
          showError={!email || !isEmailValid(email)}
          errorMessage={t('noUserNameError')}
        />
        <RoleSelector role={role} onChange={setRole} hideProjectAdmin={regionIdOverride !== null} />

        {showRegionSelector ? (
          <RegionSelector onSelect={region => setRegionId(region ? region.id : null)} selectedId={regionId} />
        ) : null}
        <FormGroup>
          <BaseCheckbox
            label={
              <>
                {' '}
                <b>{t('sendWelcomeMail')}</b>
                <br />
                {t('sendWelcomeMailExplanation')}
              </>
            }
            checked={sendWelcomeMail}
            onChange={checked => setSendWelcomeMail(checked)}
            hasError={false}
            errorMessage={undefined}
          />
        </FormGroup>
      </Stack>
    </ConfirmDialog>
  )
}

export default CreateUserDialog
