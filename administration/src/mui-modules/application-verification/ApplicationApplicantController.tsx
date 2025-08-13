import { Stack } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { ApplicationStatus, useGetApplicationByApplicantQuery } from '../../generated/graphql'
import { parseApplication } from '../../shared/application'
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
  const application = parseApplication(applicationQueryHandler.data.application)

  if (application.status === ApplicationStatus.Withdrawn) {
    return (
      <Stack sx={{ flexGrow: 1, alignSelf: 'center', justifyContent: 'center', p: 2 }}>
        <AlertBox severity='info' description={t('alreadyWithdrawn')} />
      </Stack>
    )
  }
  if (isWithdrawn) {
    return (
      <Stack sx={{ flexGrow: 1, alignSelf: 'center', justifyContent: 'center', p: 2 }}>
        <AlertBox severity='info' description={t('withdrawConfirmation')} />
      </Stack>
    )
  }
  return (
    <Stack sx={{ alignSelf: 'center', justifyContent: 'flex-start' }}>
      <ApplicationApplicantView
        application={application}
        onWithdraw={() => setIsWithdrawn(true)}
        providedKey={providedKey}
      />
    </Stack>
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
