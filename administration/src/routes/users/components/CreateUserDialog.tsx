import { PersonAdd } from '@mui/icons-material'
import { Stack } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CardTextField from '../../../cards/extensions/components/CardTextField'
import BaseCheckbox from '../../../components/BaseCheckbox'
import ConfirmDialog from '../../../components/ConfirmDialog'
import getMessageFromApolloError from '../../../errors/getMessageFromApolloError'
import { Role, useCreateAdministratorMutation } from '../../../generated/graphql'
import { isEmailValid } from '../../../util/verifications'
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
  const { enqueueSnackbar } = useSnackbar()
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
      enqueueSnackbar(title, { variant: 'error' })
    },
    onCompleted: () => {
      enqueueSnackbar(t('addUserSuccess'), { variant: 'success' })
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

  const showRegionSelector =
    regionIdOverride === null && role !== null && rolesWithRegion.includes(role)
  const userCreationDisabled =
    !email || role === null || (showRegionSelector && regionId === null) || !isEmailValid(email)
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
      }
    >
      <Stack sx={{ paddingY: 1, gap: 2 }}>
        <CardTextField
          id='create-user-name-input'
          label={t('createUserEmailLabel')}
          placeholder='erika.musterfrau@example.org'
          value={email}
          onChange={value => setEmail(value)}
          showError={!email || !isEmailValid(email)}
          errorMessage={t('noUserNameError')}
          required
        />
        <RoleSelector selectedRole={role} onChange={setRole} />

        {showRegionSelector ? (
          <RegionSelector
            onSelect={region => setRegionId(region ? region.id : null)}
            selectedId={regionId}
          />
        ) : null}

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
      </Stack>
    </ConfirmDialog>
  )
}

export default CreateUserDialog
