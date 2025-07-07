import { SnackbarProvider } from 'notistack'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { ApplicationStatus, useGetApplicationByApplicantQuery } from '../../generated/graphql'
import AlertBox from '../base/AlertBox'
import getQueryResult from '../util/getQueryResult'
import ApplicationApplicantView from './ApplicationApplicantView'

const ApplicationApplicantController = ({ providedKey }: { providedKey: string }): ReactElement => {
  const { t } = useTranslation('applicationApplicant')
  const [isWithdrawn, setIsWithdrawn] = useState<boolean>(false)
  const applicationQuery = useGetApplicationByApplicantQuery({
    variables: { accessKey: providedKey },
  })
  const applicationQueryHandler = getQueryResult(applicationQuery)
  if (!applicationQueryHandler.successful) {
    return applicationQueryHandler.component
  }
  const application = applicationQueryHandler.data.application

  if (application.status === ApplicationStatus.Withdrawn) {
    return <AlertBox severity='info' description={t('alreadyWithdrawn')} />
  }
  if (isWithdrawn) {
    return <AlertBox severity='info' description={t('withdrawConfirmation')} />
  }
  return (
    <ApplicationApplicantView
      application={application}
      gotWithdrawn={() => setIsWithdrawn(true)}
      providedKey={providedKey}
    />
  )
}

const ControllerWithAccessKey = (): ReactElement | null => {
  const { accessKey } = useParams()

  if (!accessKey) {
    return null
  }
  return (
    <SnackbarProvider>
      <ApplicationApplicantController providedKey={accessKey} />
    </SnackbarProvider>
  )
}

export default ControllerWithAccessKey
