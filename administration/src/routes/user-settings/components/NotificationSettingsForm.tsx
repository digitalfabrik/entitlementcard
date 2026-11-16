import { Stack, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'urql'

import BaseCheckbox from '../../../components/BaseCheckbox'
import SettingsCard from '../../../components/SettingsCard'
import { messageFromGraphQlError } from '../../../errors'
import { GetNotificationSettingsQuery, UpdateNotificationSettingsDocument } from '../../../graphql'

const NotificationSettingsForm = ({
  notificationSettings,
}: {
  notificationSettings: GetNotificationSettingsQuery['notificationSettings']
}): ReactElement => {
  const { t } = useTranslation('userSettings')
  const { enqueueSnackbar } = useSnackbar()
  const [receiveEmailForActivation, setReceiveEmailForActivation] = useState<boolean>(
    notificationSettings.notificationOnApplication,
  )
  const [receiveEmailForVerification, setReceiveEmailForVerification] = useState<boolean>(
    notificationSettings.notificationOnVerification,
  )
  const [updateNotificationSettingsState, updateNotificationSettingsMutation] = useMutation(
    UpdateNotificationSettingsDocument,
  )

  const reset = () => {
    setReceiveEmailForActivation(notificationSettings.notificationOnApplication)
    setReceiveEmailForVerification(notificationSettings.notificationOnVerification)
  }

  const submit = async () => {
    const result = await updateNotificationSettingsMutation({
      notificationSettings: {
        notificationOnApplication: receiveEmailForActivation,
        notificationOnVerification: receiveEmailForVerification,
      },
    })

    if (result.error) {
      const { title } = messageFromGraphQlError(result.error)
      enqueueSnackbar(title, { variant: 'error' })
      reset()
    } else {
      enqueueSnackbar(t('notificationUpdateSuccess'), { variant: 'success' })
    }
  }

  return (
    <SettingsCard
      title={t('notifications')}
      action={{
        onSubmit: submit,
        label: t('save'),
        loading: updateNotificationSettingsState.fetching,
      }}
    >
      <Typography component='p'>{t('notificationsExplanation')}</Typography>
      <Stack>
        <BaseCheckbox
          checked={receiveEmailForActivation}
          onChange={checked => setReceiveEmailForActivation(checked)}
          label={<Typography>{t('newApplications')}</Typography>}
          hasError={false}
          errorMessage={undefined}
        />
        <BaseCheckbox
          checked={receiveEmailForVerification}
          onChange={checked => setReceiveEmailForVerification(checked)}
          label={<Typography>{t('newVerifications')}</Typography>}
          hasError={false}
          errorMessage={undefined}
        />
      </Stack>
    </SettingsCard>
  )
}

export default NotificationSettingsForm
