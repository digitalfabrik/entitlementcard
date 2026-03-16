import { StackProps } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { Temporal } from 'temporal-polyfill'

import AlertBox from '../../components/AlertBox'
import PageLayout from '../../components/PageLayout'
import { ApplicationStatus, useGetApplicationByApplicantQuery } from '../../generated/graphql'
import getQueryResult from '../../util/getQueryResult'
import { ApplicationStatusNote } from '../applications/components/ApplicationStatusNote'
import {
  applicationWasAlreadyProcessed,
  getAlertSeverityByApplicationStatus,
  parseApplication,
} from '../applications/utils/application'
import ApplicationApplicantView from './ApplicationApplicantView'

const centeredContainerSx: StackProps['sx'] = {
  alignSelf: 'center',
  justifyContent: 'center',
  p: 2,
}

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
      <PageLayout containerSx={centeredContainerSx}>
        <AlertBox severity='info' description={t('alreadyWithdrawn')} />
      </PageLayout>
    )
  }
  if (isWithdrawn) {
    return (
      <PageLayout containerSx={centeredContainerSx}>
        <AlertBox severity='info' description={t('withdrawConfirmation')} />
      </PageLayout>
    )
  }

  if (applicationWasAlreadyProcessed(application.status) && !!application.statusResolvedDate) {
    return (
      <PageLayout containerSx={centeredContainerSx}>
        <AlertBox
          severity={getAlertSeverityByApplicationStatus(application.status)}
          title={t(
            application.status === ApplicationStatus.Rejected
              ? 'titleStatusRejected'
              : 'titleStatusApproved',
          )}
          description={
            <ApplicationStatusNote
              statusResolvedDate={Temporal.Instant.from(application.statusResolvedDate)}
              status={application.status}
              showIcon={false}
            />
          }
        />
      </PageLayout>
    )
  }

  return (
    <PageLayout containerSx={{ alignSelf: 'center', justifyContent: 'flex-start' }}>
      <ApplicationApplicantView
        application={application}
        onWithdraw={() => setIsWithdrawn(true)}
        providedKey={providedKey}
      />
    </PageLayout>
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
