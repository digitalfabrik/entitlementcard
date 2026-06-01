import { Button, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { ReactElement, useState } from 'react'
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

type NotificationState = { notificationOnApplication: boolean; notificationOnVerification: boolean }

const NotificationSettings = (): ReactElement => {
  const { t } = useTranslation('userSettings')
  const { enqueueSnackbar } = useSnackbar()
  const [pendingSettings, setPendingSettings] = useState<NotificationState | null>(null)
  const [lastSaved, setLastSaved] = useState<NotificationState | null>(null)
  const [updateNotificationSettingsState, updateNotificationSettingsMutation] = useMutation(
    UpdateNotificationSettingsDocument,
  )
  const [notificationSettingsState, notificationSettingsQuery] = useQuery({
    query: GetNotificationSettingsDocument,
  })

  const baseSettings = lastSaved ?? notificationSettingsState.data?.notificationSettings
  const notificationOnApplication =
    pendingSettings?.notificationOnApplication ?? baseSettings?.notificationOnApplication ?? false
  const notificationOnVerification =
    pendingSettings?.notificationOnVerification ?? baseSettings?.notificationOnVerification ?? false

  const submit = async () => {
    const result = await updateNotificationSettingsMutation({
      notificationSettings: {
        notificationOnApplication,
        notificationOnVerification,
      },
    })

    if (result.error) {
      const { title } = messageFromGraphQlError(result.error)
      enqueueSnackbar(title, { variant: 'error' })
      setPendingSettings(null)
    } else {
      enqueueSnackbar(t('notificationUpdateSuccess'), { variant: 'success' })
      setLastSaved({ notificationOnApplication, notificationOnVerification })
      setPendingSettings(null)
    }
  }

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
          checked={notificationOnApplication}
          onChange={checked =>
            setPendingSettings({ notificationOnApplication: checked, notificationOnVerification })
          }
          label={<Typography>{t('newApplications')}</Typography>}
          hasError={false}
          errorMessage={undefined}
        />
        <BaseCheckbox
          checked={notificationOnVerification}
          onChange={checked =>
            setPendingSettings({ notificationOnApplication, notificationOnVerification: checked })
          }
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
