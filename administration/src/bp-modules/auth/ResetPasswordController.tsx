import { Callout, Card, Classes, InputGroup } from '@blueprintjs/core'
import { Button, FormControl, FormLabel, Stack, Typography } from '@mui/material'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useCheckPasswordResetLinkQuery, useResetPasswordMutation } from '../../generated/graphql'
import getQueryResult from '../../mui-modules/util/getQueryResult'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { useAppToaster } from '../AppToaster'
import PasswordInput from '../PasswordInput'
import StandaloneCenter from '../StandaloneCenter'
import validateNewPasswordInput from './validateNewPasswordInput'

const ResetPasswordController = (): ReactElement => {
  const config = useContext(ProjectConfigContext)
  const appToaster = useAppToaster()
  const [queryParams] = useSearchParams()
  const adminEmail = queryParams.get('email') ?? ''
  const { t } = useTranslation('auth')
  const [newPassword, setNewPassword] = useState<string>()
  const [repeatNewPassword, setRepeatNewPassword] = useState<string>()
  const navigate = useNavigate()

  const checkPasswordResetLinkQuery = useCheckPasswordResetLinkQuery({
    variables: {
      project: config.projectId,
      resetKey: queryParams.get('token')!,
    },
  })

  const [resetPassword, { loading }] = useResetPasswordMutation({
    onCompleted: () => {
      appToaster?.show({ intent: 'success', message: t('setPasswordSuccess') })
      navigate('/')
    },
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({
        intent: 'danger',
        message: title,
      })
    },
  })

  const submit = () =>
    resetPassword({
      variables: {
        project: config.projectId,
        email: adminEmail,
        newPassword: newPassword ?? '',
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

            {warnMessage === null || !isDirty ? null : <Callout intent='danger'>{warnMessage}</Callout>}
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
