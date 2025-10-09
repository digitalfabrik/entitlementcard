import { Edit } from '@mui/icons-material'
import { Link, Stack, Typography } from '@mui/material'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { WhoAmIContext } from '../../WhoAmIProvider'
import CardTextField from '../../cards/extensions/components/CardTextField'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { Administrator, Role, useEditAdministratorMutation } from '../../generated/graphql'
import ConfirmDialog from '../../mui-modules/application/ConfirmDialog'
import AlertBox from '../../mui-modules/base/AlertBox'
import BaseCheckbox from '../../mui-modules/base/BaseCheckbox'
import { isEmailValid } from '../../shared/verifications'
import { useAppToaster } from '../AppToaster'
import RegionSelector from './RegionSelector'
import RoleSelector from './RoleSelector'

const EditUserDialog = ({
  selectedUser,
  onClose,
  onSuccess,
  regionIdOverride,
}: {
  onClose: () => void
  selectedUser: Administrator | null
  onSuccess: () => void
  // If regionIdOverride is set, the region selector will be hidden, and only RegionAdministrator and RegionManager
  // roles are selectable.
  regionIdOverride: number | null
}): ReactElement => {
  const appToaster = useAppToaster()
  const { me, refetch: refetchMe } = useContext(WhoAmIContext)
  const { t } = useTranslation('users')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role | null>(null)
  const [regionId, setRegionId] = useState<number | null>(null)
  const [notificationConfirmed, setNotificationConfirmed] = useState(false)
  const rolesWithRegion = [Role.RegionManager, Role.RegionAdmin]

  useEffect(() => {
    if (selectedUser !== null) {
      setEmail(selectedUser.email)
      setRole(selectedUser.role)
      setRegionId(selectedUser.regionId === undefined ? null : selectedUser.regionId)
    }
  }, [selectedUser])

  const [editAdministrator, { loading }] = useEditAdministratorMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
    onCompleted: () => {
      appToaster?.show({ intent: 'success', message: t('editUserSuccess') })
      onClose()
      if (me?.id === selectedUser?.id) {
        refetchMe()
      } else {
        onSuccess()
      }
    },
  })

  const getRegionId = () => {
    if (regionIdOverride !== null) {
      return regionIdOverride
    }
    return role !== null && rolesWithRegion.includes(role) ? regionId : null
  }

  const onEditUser = () => {
    if (selectedUser === null) {
      console.error('Form submitted in an unexpected state.')
      return
    }

    editAdministrator({
      variables: {
        adminId: selectedUser.id,
        newEmail: email,
        newRole: role as Role,
        newRegionId: getRegionId(),
      },
    })
  }
  const showRegionSelector = regionIdOverride === null && role !== null && rolesWithRegion.includes(role)
  const notificationShownAndNotConfirmed = selectedUser?.id === me?.id && !notificationConfirmed
  const userEditDisabled =
    !email || role === null || (showRegionSelector && regionId === null) || notificationShownAndNotConfirmed

  const editUserAlertDescription = (
    <>
      {selectedUser?.id === me?.id ? (
        <>
          {t('youCanChangeYourOwnPassword')}{' '}
          <Link href='/user-settings' target='_blank' rel='noreferrer'>
            {t('userSettings')}
          </Link>{' '}
          {t('change')}.
        </>
      ) : (
        <>
          {t('userCanChangePassword')}{' '}
          <Link href='/forgot-password' target='_blank' rel='noreferrer'>
            {`${window.location.origin}/forgot-password`}
          </Link>{' '}
          {t('reset')}.
        </>
      )}
    </>
  )

  return (
    <ConfirmDialog
      open={selectedUser !== null}
      onClose={onClose}
      title={t('editUser')}
      id='edit-user-dialog'
      onConfirm={onEditUser}
      loading={loading}
      actionDisabled={userEditDisabled}
      confirmButtonText={t('editUser')}
      confirmButtonIcon={<Edit />}>
      <Stack sx={{ paddingY: 1, gap: 2 }}>
        <CardTextField
          id='edit-user-name-input'
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
        <AlertBox sx={{ margin: 0 }} severity='info' description={editUserAlertDescription} />
        {selectedUser?.id === me?.id ? (
          <AlertBox
            sx={{ margin: 0 }}
            severity='error'
            title={t('youEditYourOwnAccount')}
            description={
              <Typography variant='body2' component='div'>
                {t('youMayCannotUndoThis')}
                <BaseCheckbox
                  label={t('ownAccountWarningConfirmation')}
                  required
                  checked={notificationConfirmed}
                  onChange={setNotificationConfirmed}
                  hasError={false}
                  errorMessage={undefined}
                />
              </Typography>
            }
          />
        ) : null}
      </Stack>
    </ConfirmDialog>
  )
}

export default EditUserDialog
