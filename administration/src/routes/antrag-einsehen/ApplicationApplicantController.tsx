import { Stack } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { Temporal } from 'temporal-polyfill'

import AlertBox from '../../components/AlertBox'
import CenteredStack from '../../components/CenteredStack'
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
      <PageLayout>
        <CenteredStack>
          <AlertBox severity='info' description={t('alreadyWithdrawn')} />
        </CenteredStack>
      </PageLayout>
    )
  }
  if (isWithdrawn) {
    return (
      <PageLayout>
        <CenteredStack>
          <AlertBox severity='info' description={t('withdrawConfirmation')} />
        </CenteredStack>
      </PageLayout>
    )
  }

  if (applicationWasAlreadyProcessed(application.status) && !!application.statusResolvedDate) {
    return (
      <PageLayout>
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
                statusResolvedDate={Temporal.Instant.from(application.statusResolvedDate)}
                status={application.status}
                showIcon={false}
              />
            }
          />
        </CenteredStack>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <Stack sx={{ alignSelf: 'center', justifyContent: 'flex-start', flexGrow: 1 }}>
        <ApplicationApplicantView
          application={application}
          onWithdraw={() => setIsWithdrawn(true)}
          providedKey={providedKey}
        />
      </Stack>
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
