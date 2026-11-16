import { ReactElement } from 'react'
import { useQuery } from 'urql'

import { GetNotificationSettingsDocument } from '../../../graphql'
import getQueryResult from '../../../util/getQueryResult'
import NotificationSettingsForm from './NotificationSettingsForm'

const NotificationSettingsController = (): ReactElement => {
  const [notificationSettingsState, notificationSettingsQuery] = useQuery({
    query: GetNotificationSettingsDocument,
  })
  const notificationQueryResult = getQueryResult(
    notificationSettingsState,
    notificationSettingsQuery,
  )

  if (!notificationQueryResult.successful) {
    return notificationQueryResult.component
  }

  const { notificationSettings } = notificationQueryResult.data
  return (
    <NotificationSettingsForm
      key={`${notificationSettings.notificationOnApplication}-${notificationSettings.notificationOnVerification}`}
      notificationSettings={notificationSettings}
    />
  )
}

export default NotificationSettingsController
