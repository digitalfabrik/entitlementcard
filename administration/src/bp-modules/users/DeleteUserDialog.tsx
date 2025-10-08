import { PersonRemove } from '@mui/icons-material'
import { Box, Stack, Typography } from '@mui/material'
import React, { ReactElement, useContext, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { useAppSnackbar } from '../../AppSnackbar'
import { AuthContext } from '../../AuthProvider'
import { WhoAmIContext } from '../../WhoAmIProvider'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { Administrator, useDeleteAdministratorMutation } from '../../generated/graphql'
import ConfirmDialog from '../../mui-modules/application/ConfirmDialog'
import AlertBox from '../../mui-modules/base/AlertBox'
import BaseCheckbox from '../../mui-modules/base/BaseCheckbox'

const DeleteUserDialog = ({
  selectedUser,
  onClose,
  onSuccess,
}: {
  onClose: () => void
  selectedUser: Administrator | null
  onSuccess: () => void
}): ReactElement => {
  const appSnackbar = useAppSnackbar()
  const { signOut } = useContext(AuthContext)
  const actingAdminId = useContext(WhoAmIContext).me?.id
  const [deleteWarningConfirmed, setDeleteWarningConfirmed] = useState(false)
  const { t } = useTranslation('users')

  const [deleteAdministrator, { loading }] = useDeleteAdministratorMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appSnackbar.enqueueError(title)
    },
    onCompleted: () => {
      appSnackbar.enqueueSuccess(t('deleteUserSuccess'))
      onClose()
      onSuccess()
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

    if (selectedUser.id === actingAdminId) {
      signOut()
    }
  }

  const alertBoxContent = (
    <Box sx={{ px: 1, paddingTop: 1 }}>
      {' '}
      <Typography variant='body1' fontWeight='bold'>
        {t('deleteOwnAccountWarning')}
      </Typography>{' '}
      <Typography variant='body1'>{t('deleteOwnAccountWarningExplanation')}</Typography>
      <BaseCheckbox
        checked={deleteWarningConfirmed}
        onChange={setDeleteWarningConfirmed}
        required
        label={t('ownAccountWarningConfirmation')}
        hasError={false}
        errorMessage={undefined}
      />
    </Box>
  )

  return (
    <ConfirmDialog
      open={selectedUser !== null}
      title={t('deleteUserConfirmPrompt')}
      id='delete-user-dialog'
      onClose={onClose}
      color='error'
      onConfirm={deleteUser}
      loading={loading}
      actionDisabled={selectedUser?.id === actingAdminId && !deleteWarningConfirmed}
      confirmButtonIcon={<PersonRemove />}
      confirmButtonText={t('deleteUser')}>
      <Stack gap={2}>
        <Box>
          <Typography variant='body1'>
            <Trans i18nKey='users:deleteUserIrrevocableConfirmPrompt' values={{ mail: selectedUser?.email }} />
          </Typography>
        </Box>
        {selectedUser?.id !== actingAdminId ? null : (
          <AlertBox sx={{ margin: 0 }} severity='error' description={alertBoxContent} />
        )}
      </Stack>
    </ConfirmDialog>
  )
}

export default DeleteUserDialog
