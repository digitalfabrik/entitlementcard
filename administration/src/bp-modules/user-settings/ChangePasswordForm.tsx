import { Button, Stack, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useWhoAmI } from '../../WhoAmIProvider'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useChangePasswordMutation } from '../../generated/graphql'
import AlertBox from '../../mui-modules/base/AlertBox'
import PasswordInput from '../PasswordInput'
import validatePasswordInput from '../auth/validateNewPasswordInput'
import SettingsCard, { SettingsCardButtonBox } from './SettingsCard'

const ChangePasswordForm = (): ReactElement => {
  const { t: tAuth } = useTranslation('auth')
  const { t } = useTranslation('userSettings')
  const [currentPassword, setCurrentPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [repeatNewPassword, setRepeatNewPassword] = useState<string>('')

  const { enqueueSnackbar } = useSnackbar()
  const [changePassword, { loading }] = useChangePasswordMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      enqueueSnackbar(title, { variant: 'error' })
    },
    onCompleted: () => {
      enqueueSnackbar(t('passwordChangeSuccessful'), { variant: 'success' })
      setCurrentPassword('')
      setNewPassword('')
      setRepeatNewPassword('')
    },
  })

  const email = useWhoAmI().me.email

  const isDirty = newPassword !== '' || repeatNewPassword !== ''

  const warnMessage = isDirty ? validatePasswordInput(newPassword, repeatNewPassword, tAuth) : null

  const valid = warnMessage === null

  const submit = async () =>
    changePassword({
      variables: {
        newPassword,
        currentPassword,
        email,
      },
    })

  return (
    <SettingsCard title={t('changePassword')}>
      <Typography component='p' mb={2}>
        {t('changePasswordExplanation')}
      </Typography>
      <form
        onSubmit={event => {
          event.preventDefault()
          submit()
        }}>
        <Stack sx={{ gap: 2 }}>
          <PasswordInput value={currentPassword} setValue={setCurrentPassword} label={t('currentPassword')} />
          <PasswordInput value={newPassword} setValue={setNewPassword} label={t('newPassword')} />
          <PasswordInput value={repeatNewPassword} setValue={setRepeatNewPassword} label={t('newPassword')} />

          {warnMessage === null ? null : <AlertBox sx={{ my: 2, mx: 0 }} severity='error' description={warnMessage} />}
          <SettingsCardButtonBox>
            <Button type='submit' disabled={!valid} loading={loading}>
              {t('changePassword')}
            </Button>
          </SettingsCardButtonBox>
        </Stack>
      </form>
    </SettingsCard>
  )
}

export default ChangePasswordForm
