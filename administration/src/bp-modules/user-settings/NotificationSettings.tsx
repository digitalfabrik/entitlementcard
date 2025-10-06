import { Checkbox, H2 } from '@blueprintjs/core'
import { Button, Typography } from '@mui/material'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useGetNotificationSettingsQuery, useUpdateNotificationSettingsMutation } from '../../generated/graphql'
import getQueryResult from '../../mui-modules/util/getQueryResult'
import { useAppToaster } from '../AppToaster'
import SettingsCard from './SettingsCard'

const NotificationSettings = (): ReactElement => {
  const { t } = useTranslation('userSettings')
  const [receiveEmailForActivation, setReceiveEmailForActivation] = useState<boolean>(false)
  const [receiveEmailForVerification, setReceiveEmailForVerification] = useState<boolean>(false)

  const appToaster = useAppToaster()
  const [updateNotificationSettings, { loading }] = useUpdateNotificationSettingsMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
    onCompleted: () => appToaster?.show({ intent: 'success', message: t('notificationUpdateSuccess') }),
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
      <Typography component='p' variant='body2'>
        {t('notificationsExplanation')}
      </Typography>
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
