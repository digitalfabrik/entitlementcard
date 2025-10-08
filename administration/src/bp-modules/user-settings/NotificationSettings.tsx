import { Checkbox, H2 } from '@blueprintjs/core'
import { Button } from '@mui/material'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppSnackbar } from '../../AppSnackbar'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useGetNotificationSettingsQuery, useUpdateNotificationSettingsMutation } from '../../generated/graphql'
import getQueryResult from '../../mui-modules/util/getQueryResult'
import SettingsCard from './SettingsCard'

const NotificationSettings = (): ReactElement => {
  const { t } = useTranslation('userSettings')
  const [receiveEmailForActivation, setReceiveEmailForActivation] = useState<boolean>(false)
  const [receiveEmailForVerification, setReceiveEmailForVerification] = useState<boolean>(false)

  const appSnackbar = useAppSnackbar()
  const [updateNotificationSettings, { loading }] = useUpdateNotificationSettingsMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appSnackbar.enqueueError(title)
    },
    onCompleted: () => {
      appSnackbar.enqueueSuccess(t('notificationUpdateSuccess'))
    },
  })

  const notificationSettingsQuery = useGetNotificationSettingsQuery()

  useEffect(() => {
    const notificationQueryResult = getQueryResult(notificationSettingsQuery)
    if (notificationQueryResult.successful) {
      const { notificationOnApplication, notificationOnVerification } =
        notificationQueryResult.data.notificationSettings
      setReceiveEmailForActivation(notificationOnApplication)
      setReceiveEmailForVerification(notificationOnVerification)
    }
  }, [notificationSettingsQuery, t])

  const notificationQueryResult = getQueryResult(notificationSettingsQuery)
  if (!notificationQueryResult.successful) {
    return notificationQueryResult.component
  }

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

  return (
    <SettingsCard>
      <H2>{t('notifications')}</H2>
      <p>{t('notificationsExplanation')}</p>
      <form
        onSubmit={event => {
          event.preventDefault()
          submit()
        }}>
        <Checkbox
          checked={receiveEmailForActivation}
          onChange={e => setReceiveEmailForActivation(e.currentTarget.checked)}
          label={t('newApplications')}
        />
        <Checkbox
          checked={receiveEmailForVerification}
          onChange={e => setReceiveEmailForVerification(e.currentTarget.checked)}
          label={t('newVerifications')}
        />
        <div style={{ textAlign: 'right', padding: '10px 0' }}>
          <Button type='submit' loading={loading}>
            {t('save')}
          </Button>
        </div>
      </form>
    </SettingsCard>
  )
}

export default NotificationSettings
