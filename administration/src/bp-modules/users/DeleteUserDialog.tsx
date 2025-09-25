import { Callout, Checkbox } from '@blueprintjs/core'
import { PersonRemove } from '@mui/icons-material'
import { Stack } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { AuthContext } from '../../AuthProvider'
import { WhoAmIContext } from '../../WhoAmIProvider'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { Administrator, useDeleteAdministratorMutation } from '../../generated/graphql'
import ConfirmDialog from '../../mui-modules/application/ConfirmDialog'
import { useAppToaster } from '../AppToaster'

const DeleteUserDialog = ({
  selectedUser,
  onClose,
  onSuccess,
}: {
  onClose: () => void
  selectedUser: Administrator | null
  onSuccess: () => void
}): ReactElement => {
  const appToaster = useAppToaster()
  const { signOut } = useContext(AuthContext)
  const actingAdminId = useContext(WhoAmIContext).me?.id
  const { t } = useTranslation('users')

  const [deleteAdministrator, { loading }] = useDeleteAdministratorMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
    onCompleted: () => {
      appToaster?.show({ intent: 'success', message: t('deleteUserSuccess') })
      if (selectedUser?.id === actingAdminId) {
        signOut()
      } else {
        onClose()
        onSuccess()
      }
    },
  })

  const deleteUser = () => {
    if (selectedUser === null) {
      console.error('Form submitted in an unexpected state.')
      return
    }

    deleteAdministrator({
      variables: {
        adminId: selectedUser.id,
      },
    })
  }

  return (
    <ConfirmDialog
      open={selectedUser !== null}
      title={t('deleteUserConfirmPrompt', { mail: selectedUser?.email })}
      id='delete-user-dialog'
      onClose={onClose}
      color='error'
      onConfirm={deleteUser}
      loading={loading}
      confirmButtonIcon={<PersonRemove />}
      confirmButtonText={t('deleteUser')}>
      <Stack>
        {t('deleteUserIrrevocableConfirmPrompt', { mail: selectedUser?.email })}
        {selectedUser?.id !== actingAdminId ? null : (
          <Callout intent='danger' style={{ marginTop: '16px' }}>
            <b>{t('deleteOwnAccountWarning')}</b> {t('deleteOwnAccountWarningExplanation')}
            <Checkbox required>{t('ownAccountWarningConfirmation')}</Checkbox>
          </Callout>
        )}
      </Stack>
    </ConfirmDialog>
  )
}

export default DeleteUserDialog
