import { Button, Stack, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'urql'

import validatePasswordInput from '../../../auth/validateNewPasswordInput'
import AlertBox from '../../../components/AlertBox'
import PasswordInput from '../../../components/PasswordInput'
import SettingsCard, { SettingsCardButtonBox } from '../../../components/SettingsCard'
import messageFromGraphQlError from '../../../errors/getMessageFromApolloError'
import { ChangePasswordDocument } from '../../../graphql'
import { useWhoAmI } from '../../../provider/WhoAmIProvider'

const ChangePasswordForm = (): ReactElement => {
  const { t: tAuth } = useTranslation('auth')
  const { t } = useTranslation('userSettings')
  const [currentPassword, setCurrentPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [repeatNewPassword, setRepeatNewPassword] = useState<string>('')
  const { enqueueSnackbar } = useSnackbar()
  const [changePasswordState, changePasswordMutation] = useMutation(ChangePasswordDocument)
  const email = useWhoAmI().me.email

  const isDirty = newPassword !== '' || repeatNewPassword !== ''
  const warnMessage = isDirty ? validatePasswordInput(newPassword, repeatNewPassword, tAuth) : null
  const valid = warnMessage === null

  const submit = async () => {
    const result = await changePasswordMutation({
      newPassword,
      currentPassword,
      email,
    })

    if (result.error) {
      const { title } = messageFromGraphQlError(result.error)
      enqueueSnackbar(title, { variant: 'error' })
    } else {
      enqueueSnackbar(t('passwordChangeSuccessful'), { variant: 'success' })
      setCurrentPassword('')
      setNewPassword('')
      setRepeatNewPassword('')
    }
  }

  return (
    <SettingsCard title={t('changePassword')}>
      <Typography component='p' mb={2}>
        {t('changePasswordExplanation')}
      </Typography>
      <form
        onSubmit={event => {
          event.preventDefault()
          submit()
        }}
      >
        <Stack sx={{ gap: 2 }}>
          <PasswordInput
            value={currentPassword}
            setValue={setCurrentPassword}
            label={t('currentPassword')}
          />
          <PasswordInput value={newPassword} setValue={setNewPassword} label={t('newPassword')} />
          <PasswordInput
            value={repeatNewPassword}
            setValue={setRepeatNewPassword}
            label={t('newPassword')}
          />

          {warnMessage === null ? null : (
            <AlertBox sx={{ my: 2, mx: 0 }} severity='error' description={warnMessage} />
          )}
          <SettingsCardButtonBox>
            <Button type='submit' disabled={!valid} loading={changePasswordState.fetching}>
              {t('changePassword')}
            </Button>
          </SettingsCardButtonBox>
        </Stack>
      </form>
    </SettingsCard>
  )
}

export default ChangePasswordForm
