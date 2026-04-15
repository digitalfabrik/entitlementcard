import { Button, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'urql'

import BaseCheckbox from '../../../components/BaseCheckbox'
import SettingsCard, { SettingsCardButtonBox } from '../../../components/SettingsCard'
import { messageFromGraphQlError } from '../../../errors'
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

  const reset = () => {
    const state = notificationSettingsState.data?.notificationSettings

    if (state) {
      setReceiveEmailForActivation(state.notificationOnApplication)
      setReceiveEmailForVerification(state.notificationOnVerification)
    }
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

  useEffect(() => {
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationSettingsState])

  const notificationQueryResult = getQueryResult(
    notificationSettingsState,
    notificationSettingsQuery,
  )

  if (!notificationQueryResult.successful) {
    return notificationQueryResult.component
  }

  return (
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
