import { Callout, H2 } from '@blueprintjs/core'
import { Button, FormControl, FormLabel, Stack } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppSnackbar } from '../../AppSnackbar'
import { useWhoAmI } from '../../WhoAmIProvider'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useChangePasswordMutation } from '../../generated/graphql'
import PasswordInput from '../PasswordInput'
import validatePasswordInput from '../auth/validateNewPasswordInput'
import SettingsCard from './SettingsCard'

const ChangePasswordForm = (): ReactElement => {
  const { t: tAuth } = useTranslation('auth')
  const { t } = useTranslation('userSettings')
  const [currentPassword, setCurrentPassword] = useState<string>()
  const [newPassword, setNewPassword] = useState<string>()
  const [repeatNewPassword, setRepeatNewPassword] = useState<string>()

  const appSnackbar = useAppSnackbar()
  const [changePassword, { loading }] = useChangePasswordMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appSnackbar.enqueueError(title)
    },
    onCompleted: () => {
      appSnackbar.enqueueSuccess(t('passwordChangeSuccessful'))
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
        newPassword: newPassword ?? '',
        currentPassword: currentPassword ?? '',
        email,
      },
    })

  return (
    <SettingsCard>
      <H2>{t('changePassword')}</H2>
      <p>{t('changePasswordExplanation')}</p>
      <form
        onSubmit={event => {
          event.preventDefault()
          submit()
        }}>
        <Stack sx={{ gap: 2 }}>
          <FormControl fullWidth>
            <FormLabel>{t('currentPassword')}</FormLabel>
            <PasswordInput value={currentPassword} setValue={setCurrentPassword} />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel>{t('newPassword')}</FormLabel>
            <PasswordInput value={newPassword} setValue={setNewPassword} />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel>{t('newPasswordConfirm')}</FormLabel>
            <PasswordInput value={repeatNewPassword} setValue={setRepeatNewPassword} />
          </FormControl>

          {warnMessage === null ? null : <Callout intent='danger'>{warnMessage}</Callout>}
          <div style={{ textAlign: 'right' }}>
            <Button type='submit' disabled={!valid} loading={loading}>
              {t('changePassword')}
            </Button>
          </div>
        </Stack>
      </form>
    </SettingsCard>
  )
}

export default ChangePasswordForm
