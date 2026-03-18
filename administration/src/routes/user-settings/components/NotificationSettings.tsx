import { Button, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import BaseCheckbox from '../../../components/BaseCheckbox'
import SettingsCard, { SettingsCardButtonBox } from '../../../components/SettingsCard'
import getMessageFromApolloError from '../../../errors/getMessageFromApolloError'
import {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from '../../../generated/graphql'
import getQueryResult from '../../../util/getQueryResult'

const NotificationSettings = (): ReactElement => {
  const { t } = useTranslation('userSettings')
  const [receiveEmailForActivation, setReceiveEmailForActivation] = useState<boolean>(false)
  const [receiveEmailForVerification, setReceiveEmailForVerification] = useState<boolean>(false)

  const { enqueueSnackbar } = useSnackbar()
  const [updateNotificationSettings, { loading }] = useUpdateNotificationSettingsMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      enqueueSnackbar(title, { variant: 'error' })
    },
    onCompleted: () => {
      enqueueSnackbar(t('notificationUpdateSuccess'), { variant: 'success' })
    },
  })

  const notificationSettingsQuery = useGetNotificationSettingsQuery()

  useEffect(() => {
    const result = getQueryResult(notificationSettingsQuery)
    if (result.successful) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReceiveEmailForActivation(result.data.notificationSettings.notificationOnApplication)
      setReceiveEmailForVerification(result.data.notificationSettings.notificationOnVerification)
    }
  }, [notificationSettingsQuery, t])

  const submit = () => {
    updateNotificationSettings({
      variables: {
        notificationSettings: {
          notificationOnApplication: receiveEmailForActivation,
          notificationOnVerification: receiveEmailForVerification,
        },
      },
    })
  }

  const notificationQueryResult = getQueryResult(notificationSettingsQuery)

  return !notificationQueryResult.successful ? (
    notificationQueryResult.component
  ) : (
    <SettingsCard title={t('notifications')}>
      <Typography component='p'>{t('notificationsExplanation')}</Typography>
      <form
        onSubmit={event => {
          event.preventDefault()
          submit()
        }}
      >
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
        <SettingsCardButtonBox>
          <Button type='submit' loading={loading}>
            {t('save')}
          </Button>
        </SettingsCardButtonBox>
      </form>
    </SettingsCard>
  )
}

export default NotificationSettings
