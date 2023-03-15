import React, { useState } from 'react'
import { NonIdealState, Spinner } from '@blueprintjs/core'

import { useGetApplicationByUserAccessKeyQuery } from '../../generated/graphql'
import ErrorHandler from '../../ErrorHandler'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { ApplicationViewComponent } from './ApplicationsOverview'
import { useAppToaster } from '../AppToaster'

const NotFound = styled(NonIdealState)`
  margin: auto;
`

const CenteredMessage = styled(NonIdealState)`
  margin: auto;
`

const ApplicationUserController = (props: { providedKey: string }) => {
  const [withdrawed, setWithdrawed] = useState<boolean>(false)
  const appToaster = useAppToaster()
  const { loading, error, data, refetch } = useGetApplicationByUserAccessKeyQuery({
    variables: { accessKey: props.providedKey },
    onError: error => {
      console.error(error)
      appToaster?.show({ intent: 'danger', message: 'Etwas ist schief gelaufen.' + error })
    },
  })

  if (loading) return <Spinner />
  else if (error || !data) return <ErrorHandler refetch={refetch} />
  if (data.application.withdrawalDate) return <CenteredMessage title='Ihr Antrag wurde bereits zurückgezogen' />
  if (withdrawed) return <CenteredMessage title='Ihr Antrag wurde zurückgezogen' />
  else {
    return (
      <ApplicationViewComponent
        application={data.application}
        gotConfirmed={() => setWithdrawed(true)}
        actionType={'withdraw'}
      />
    )
  }
}

const ControllerWithAccessKey = () => {
  const { accessKey } = useParams()

  if (!accessKey) {
    return <NotFound title='Nicht gefunden' description='Diese Seite konnte nicht gefunden werden.' />
  } else {
    return <ApplicationUserController providedKey={accessKey} />
  }
}

export default ControllerWithAccessKey
