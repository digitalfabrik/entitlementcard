import { Edit } from '@mui/icons-material'
import { Link, Stack } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'urql'

import CardTextField from '../../../cards/extensions/components/CardTextField'
import AlertBox from '../../../components/AlertBox'
import BaseCheckbox from '../../../components/BaseCheckbox'
import ConfirmDialog from '../../../components/ConfirmDialog'
import { messageFromGraphQlError } from '../../../errors'
import { Administrator, EditAdministratorDocument, Role } from '../../../graphql'
import { WhoAmIContext } from '../../../provider/WhoAmIProvider'
import { isEmailValid } from '../../../util/verifications'
import RegionSelector from './RegionSelector'
import RoleSelector from './RoleSelector'

const EditUserDialog = ({
  onClose,
  onSuccess,
  selectedUser,
  regionIdOverride,
}: {
  onClose: () => void
  onSuccess: () => void
  selectedUser: Pick<Administrator, 'id' | 'email' | 'role' | 'regionId'> | null
  /**
   * If regionIdOverride is set, the region selector will be hidden, and only RegionAdministrator
   * and RegionManager roles are selectable.
   */
  regionIdOverride: number | null
}): ReactElement => {
  const { enqueueSnackbar } = useSnackbar()
  const { me, refetch: refetchMe } = useContext(WhoAmIContext)
  const { t } = useTranslation('users')
  const [email, setEmail] = useState(selectedUser?.email ?? '')
  const [role, setRole] = useState<Role | null>(selectedUser?.role ?? null)
  const [regionId, setRegionId] = useState<number | null>(selectedUser?.regionId ?? null)
  const [notificationConfirmed, setNotificationConfirmed] = useState(false)
  const [editAdministratorState, editAdministratorMutation] = useMutation(EditAdministratorDocument)

  const rolesWithRegion = [Role.RegionManager, Role.RegionAdmin]

  const onEditUser = async () => {
    if (selectedUser != null) {
      const result = await editAdministratorMutation({
        adminId: selectedUser.id,
        newEmail: email,
        newRole: role as Role,
        newRegionId:
          // eslint-disable-next-line no-nested-ternary
          regionIdOverride !== null
            ? regionIdOverride
            : role !== null && rolesWithRegion.includes(role)
              ? regionId
              : null,
      })

      if (result.error) {
        const { title } = messageFromGraphQlError(result.error)
        enqueueSnackbar(title, { variant: 'error' })
      } else {
        enqueueSnackbar(t('editUserSuccess'), { variant: 'success' })
        onClose()

        if (me?.id === selectedUser.id) {
          refetchMe()
        } else {
          onSuccess()
        }
      }
    }
  }

  const showRegionSelector =
    regionIdOverride === null && role !== null && rolesWithRegion.includes(role)
  const userEditDisabled =
    !email ||
    role === null ||
    (showRegionSelector && regionId === null) ||
    (selectedUser?.id === me?.id && !notificationConfirmed) ||
    !isEmailValid(email)

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
      onConfirm={onEditUser}
      loading={editAdministratorState.fetching}
      actionDisabled={userEditDisabled}
      confirmButtonText={t('editUser')}
      confirmButtonIcon={<Edit />}
    >
      <Stack sx={{ paddingY: 1, gap: 2 }}>
        <CardTextField
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
        <AlertBox fullWidth severity='info' description={editUserAlertDescription} />
        {selectedUser?.id === me?.id ? (
          <AlertBox
            fullWidth
            severity='error'
            title={t('youEditYourOwnAccount')}
            description={
              <>
                {t('youMayCannotUndoThis')}
                <BaseCheckbox
                  label={t('ownAccountWarningConfirmation')}
                  required
                  checked={notificationConfirmed}
                  onChange={setNotificationConfirmed}
                  hasError={false}
                  errorMessage={undefined}
                />
              </>
            }
          />
        ) : null}
      </Stack>
    </ConfirmDialog>
  )
}

export default EditUserDialog
