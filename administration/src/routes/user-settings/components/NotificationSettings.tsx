import { Button, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'urql'

import BaseCheckbox from '../../../components/BaseCheckbox'
import SettingsCard, { SettingsCardButtonBox } from '../../../components/SettingsCard'
import messageFromGraphQlError from '../../../errors/getMessageFromApolloError'
import {
  GetNotificationSettingsDocument,
  UpdateNotificationSettingsDocument,
} from '../../../graphql'
import getQueryResult from '../../../util/getQueryResult'

const NotificationSettings = (): ReactElement => {
  const { t } = useTranslation('userSettings')
  const { enqueueSnackbar } = useSnackbar()
  const [receiveEmailForActivation, setReceiveEmailForActivation] = useState<boolean>(false)
  const [receiveEmailForVerification, setReceiveEmailForVerification] = useState<boolean>(false)
  const [updateNotificationSettingsState, updateNotificationSettingsMutation] = useMutation(
    UpdateNotificationSettingsDocument,
  )
  const [notificationSettingsState, notificationSettingsQuery] = useQuery({
    query: GetNotificationSettingsDocument,
  })

  useEffect(() => {
    const result = getQueryResult(notificationSettingsState, notificationSettingsQuery)
    if (result.successful) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReceiveEmailForActivation(result.data.notificationSettings.notificationOnApplication)
      setReceiveEmailForVerification(result.data.notificationSettings.notificationOnVerification)
    }
  }, [notificationSettingsState, notificationSettingsQuery])

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
    } else {
      enqueueSnackbar(t('notificationUpdateSuccess'), { variant: 'success' })
    }
  }

  const notificationQueryResult = getQueryResult(
    notificationSettingsState,
    notificationSettingsQuery,
  )

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
          <Button type='submit' loading={updateNotificationSettingsState.fetching}>
            {t('save')}
          </Button>
        </SettingsCardButtonBox>
      </form>
    </SettingsCard>
  )
}

export default NotificationSettings
