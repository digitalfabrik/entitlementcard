import { Box, Button, Card, Stack, TextField, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'

import validateNewPasswordInput from '../../auth/validateNewPasswordInput'
import AlertBox from '../../components/AlertBox'
import PasswordInput from '../../components/PasswordInput'
import StandaloneCenter from '../../components/StandaloneCenter'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useCheckPasswordResetLinkQuery, useResetPasswordMutation } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import getQueryResult from '../../util/getQueryResult'

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
      <Card sx={{ width: '100%', maxWidth: '500px', p: 2 }}>
        <Typography variant='h4'>{config.name}</Typography>
        <Typography variant='h5'>{t('administration')}</Typography>
        <Typography variant='h6'>{t('resetPassword')}</Typography>
        <Typography component='p'>{t('setPasswordText')}</Typography>
        <form
          onSubmit={e => {
            e.preventDefault()
            submit()
          }}>
          <Stack sx={{ gap: 2, marginTop: 3, marginBottom: 2 }}>
            <TextField
              fullWidth
              autoComplete='on'
              autoFocus
              type='email'
              size='small'
              label={t('eMail')}
              value={adminEmail}
              required
              disabled
            />
            <PasswordInput
              label={t('newPassword')}
              placeholder={t('password')}
              setValue={setNewPassword}
              value={newPassword}
              disabled={loading}
              fullWidth
              autoFocus={false}
            />
            <PasswordInput
              label={t('newPasswordRepeat')}
              placeholder={t('password')}
              setValue={setRepeatNewPassword}
              value={repeatNewPassword}
              disabled={loading}
              fullWidth
              autoFocus={false}
            />
            {warnMessage === null || !isDirty ? null : (
              <AlertBox sx={{ my: 2, mx: 0 }} severity='error' description={warnMessage} />
            )}
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 1.5 }}>
            <Button href='/' variant='text'>
              {t('backToLogin')}
            </Button>
            <Button type='submit' loading={loading} variant='contained' color='primary' disabled={warnMessage !== null}>
              {t('resetPassword')}
            </Button>
          </Box>
        </form>
      </Card>
    </StandaloneCenter>
  )
}

export default ResetPasswordController
