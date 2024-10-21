import { Button, Checkbox, H2 } from '@blueprintjs/core'
import React, { ReactElement, useEffect, useState } from 'react'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useGetNotificationSettingsQuery, useUpdateNotificationSettingsMutation } from '../../generated/graphql'
import { useAppToaster } from '../AppToaster'
import getQueryResult from '../util/getQueryResult'
import SettingsCard from './SettingsCard'

type NotificationSettingsProps = {
  projectId: string
}

const NotificationSettings = ({ projectId }: NotificationSettingsProps): ReactElement => {
  const [receiveEmailForActivation, setReceiveEmailForActivation] = useState<boolean>(false)
  const [receiveEmailForVerification, setReceiveEmailForVerification] = useState<boolean>(false)

  const appToaster = useAppToaster()
  const [updateNotificationSettings, { loading }] = useUpdateNotificationSettingsMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
    onCompleted: () =>
      appToaster?.show({ intent: 'success', message: 'Benachrichtigungseinstellungen erfolgreich aktualisiert.' }),
  })

  const notificationSettingsQuery = useGetNotificationSettingsQuery({ variables: { project: projectId } })

  useEffect(() => {
    const notificationQueryResult = getQueryResult(notificationSettingsQuery)
    if (notificationQueryResult.successful) {
      const { notificationOnApplication, notificationOnVerification } =
        notificationQueryResult.data.notificationSettings
      setReceiveEmailForActivation(notificationOnApplication)
      setReceiveEmailForVerification(notificationOnVerification)
    }
  }, [notificationSettingsQuery])

  const notificationQueryResult = getQueryResult(notificationSettingsQuery)
  if (!notificationQueryResult.successful) {
    return notificationQueryResult.component
  }

  const submit = () => {
    updateNotificationSettings({
      variables: {
        project: projectId,
        notificationSettings: {
          notificationOnApplication: receiveEmailForActivation,
          notificationOnVerification: receiveEmailForVerification,
        },
      },
    })
  }

  return (
    <SettingsCard>
      <H2>Benachrichtigungen</H2>
      <p>Wählen Sie aus, für welche Aktivitäten Sie eine E-Mail erhalten möchten.</p>
      <form
        onSubmit={event => {
          event.preventDefault()
          submit()
        }}>
        <Checkbox
          checked={receiveEmailForActivation}
          onChange={e => setReceiveEmailForActivation(e.currentTarget.checked)}
          label='Neue Anträge'
        />
        <Checkbox
          checked={receiveEmailForVerification}
          onChange={e => setReceiveEmailForVerification(e.currentTarget.checked)}
          label='Antragsverifizierungen'
        />
        <div style={{ textAlign: 'right', padding: '10px 0' }}>
          <Button text='Speichern' intent='primary' type='submit' loading={loading} />
        </div>
      </form>
    </SettingsCard>
  )
}

export default NotificationSettings
