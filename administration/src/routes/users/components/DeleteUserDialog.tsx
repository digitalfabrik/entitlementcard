import { PersonRemove } from '@mui/icons-material'
import { Box, Stack, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useContext, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import getMessageFromApolloError from '../../../errors/getMessageFromApolloError'
import { Administrator, useDeleteAdministratorMutation } from '../../../generated/graphql'
import { AuthContext } from '../../../provider/AuthProvider'
import { WhoAmIContext } from '../../../provider/WhoAmIProvider'
import AlertBox from '../../../shared/components/AlertBox'
import BaseCheckbox from '../../../shared/components/BaseCheckbox'
import ConfirmDialog from '../../../shared/components/ConfirmDialog'

const DeleteUserDialog = ({
  selectedUser,
  onClose,
  onSuccess,
}: {
  onClose: () => void
  selectedUser: Administrator | null
  onSuccess: () => void
}): ReactElement => {
  const { enqueueSnackbar } = useSnackbar()
  const { signOut } = useContext(AuthContext)
  const actingAdminId = useContext(WhoAmIContext).me?.id
  const [deleteWarningConfirmed, setDeleteWarningConfirmed] = useState(false)
  const { t } = useTranslation('users')

  const [deleteAdministrator, { loading }] = useDeleteAdministratorMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      enqueueSnackbar(title, { variant: 'error' })
    },
    onCompleted: () => {
      enqueueSnackbar(t('deleteUserSuccess'), { variant: 'success' })
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
    <Box sx={{ px: 1 }}>
      {' '}
      <Typography fontWeight='bold'>{t('deleteOwnAccountWarning')}</Typography>{' '}
      <Typography>{t('deleteOwnAccountWarningExplanation')}</Typography>
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
          <Typography>
            <Trans i18nKey='users:deleteUserIrrevocableConfirmPrompt' values={{ mail: selectedUser?.email }} />
          </Typography>
        </Box>
        {selectedUser?.id !== actingAdminId ? null : (
          <AlertBox fullWidth severity='error' description={alertBoxContent} />
        )}
      </Stack>
    </ConfirmDialog>
  )
}

export default DeleteUserDialog
