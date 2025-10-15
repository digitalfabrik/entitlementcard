import { Card, Classes, InputGroup } from '@blueprintjs/core'
import { Button, FormControl, FormLabel, Stack, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useCheckPasswordResetLinkQuery, useResetPasswordMutation } from '../../generated/graphql'
import AlertBox from '../../mui-modules/base/AlertBox'
import getQueryResult from '../../mui-modules/util/getQueryResult'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import PasswordInput from '../PasswordInput'
import StandaloneCenter from '../StandaloneCenter'
import validateNewPasswordInput from './validateNewPasswordInput'

const ResetPasswordController = (): ReactElement => {
  const config = useContext(ProjectConfigContext)
  const { enqueueSnackbar } = useSnackbar()
  const [queryParams] = useSearchParams()
  const adminEmail = queryParams.get('email') ?? ''
  const { t } = useTranslation('auth')
  const [newPassword, setNewPassword] = useState<string>('')
  const [repeatNewPassword, setRepeatNewPassword] = useState<string>('')
  const navigate = useNavigate()

  const checkPasswordResetLinkQuery = useCheckPasswordResetLinkQuery({
    variables: {
      project: config.projectId,
      resetKey: queryParams.get('token')!,
    },
  })

  const [resetPassword, { loading }] = useResetPasswordMutation({
    onCompleted: () => {
      enqueueSnackbar(t('setPasswordSuccess'), { variant: 'success' })
      navigate('/')
    },
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      enqueueSnackbar(title, { variant: 'error' })
    },
  })

  const submit = () =>
    resetPassword({
      variables: {
        project: config.projectId,
        email: adminEmail,
        newPassword,
        passwordResetKey: queryParams.get('token')!,
      },
    })

  const warnMessage = validateNewPasswordInput(newPassword, repeatNewPassword, t)
  const isDirty = newPassword !== '' || repeatNewPassword !== ''

  const checkPasswordResetLinkQueryResult = getQueryResult(checkPasswordResetLinkQuery)

  if (!checkPasswordResetLinkQueryResult.successful) {
    return checkPasswordResetLinkQueryResult.component
  }

  return (
    <StandaloneCenter>
      <Card style={{ width: '100%', maxWidth: '500px' }}>
        <Typography variant='h4'>{config.name}</Typography>
        <Typography variant='h5'>{t('administration')}</Typography>
        <Typography variant='h6'>{t('resetPassword')}</Typography>
        <Typography component='p' variant='body2'>
          {t('setPasswordText')}
        </Typography>
        <form
          onSubmit={e => {
            e.preventDefault()
            submit()
          }}>
          <Stack sx={{ gap: 2 }}>
            <FormControl fullWidth>
              <FormLabel>{t('eMail')}</FormLabel>
              <InputGroup value={adminEmail} disabled type='email' />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>{t('newPassword')}</FormLabel>
              <PasswordInput setValue={setNewPassword} value={newPassword} />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>{t('newPasswordRepeat')}</FormLabel>
              <PasswordInput setValue={setRepeatNewPassword} value={repeatNewPassword} />
            </FormControl>

            {warnMessage === null || !isDirty ? null : (
              <AlertBox sx={{ my: 2, mx: 0 }} severity='error' description={warnMessage} />
            )}
          </Stack>

          <div
            className={Classes.DIALOG_FOOTER_ACTIONS}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
            <Button href='/' variant='text'>
              {t('backToLogin')}
            </Button>
            <Button type='submit' loading={loading} variant='contained' disabled={warnMessage !== null}>
              {t('resetPassword')}
            </Button>
          </div>
        </form>
      </Card>
    </StandaloneCenter>
  )
}

export default ResetPasswordController
