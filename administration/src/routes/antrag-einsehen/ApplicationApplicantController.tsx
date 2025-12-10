import { Stack } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import AlertBox from '../../components/AlertBox'
import CenteredStack from '../../components/CenteredStack'
import { ApplicationStatus, useGetApplicationByApplicantQuery } from '../../generated/graphql'
import getQueryResult from '../../util/getQueryResult'
import { ApplicationStatusNote } from '../applications/components/ApplicationStatusNote'
import {
  applicationWasAlreadyProcessed,
  getAlertSeverityByApplicationStatus,
  parseApplication,
} from '../applications/utils/application'
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
      <CenteredStack>
        <AlertBox severity='info' description={t('alreadyWithdrawn')} />
      </CenteredStack>
    )
  }
  if (isWithdrawn) {
    return (
      <CenteredStack>
        <AlertBox severity='info' description={t('withdrawConfirmation')} />
      </CenteredStack>
    )
  }

  if (applicationWasAlreadyProcessed(application.status) && !!application.statusResolvedDate) {
    return (
      <CenteredStack>
        <AlertBox
          severity={getAlertSeverityByApplicationStatus(application.status)}
          title={t(
            application.status === ApplicationStatus.Rejected
              ? 'titleStatusRejected'
              : 'titleStatusApproved',
          )}
          description={
            <ApplicationStatusNote
              statusResolvedDate={new Date(application.statusResolvedDate)}
              status={application.status}
              showIcon={false}
            />
          }
        />
      </CenteredStack>
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
  return <ApplicationApplicantController providedKey={accessKey} />
}

export default ControllerWithAccessKey
