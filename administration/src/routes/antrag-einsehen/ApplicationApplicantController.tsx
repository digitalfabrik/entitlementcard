import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { Temporal } from 'temporal-polyfill'
import { useQuery } from 'urql'

import AlertBox from '../../components/AlertBox'
import PublicPageLayout from '../../components/PublicPageLayout'
import { ApplicationStatus, GetApplicationByApplicantDocument } from '../../graphql'
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
  const [applicationByApplicantState, applicationByApplicantQuery] = useQuery({
    query: GetApplicationByApplicantDocument,
    variables: { accessKey: providedKey },
  })
  const applicationQueryHandler = getQueryResult(
    applicationByApplicantState,
    applicationByApplicantQuery,
  )
  if (!applicationQueryHandler.successful) {
    return applicationQueryHandler.component
  }
  const application = parseApplication(applicationQueryHandler.data.application)
  if (application.status === ApplicationStatus.Withdrawn) {
    return <AlertBox severity='info' description={t('alreadyWithdrawn')} />
  }
  if (isWithdrawn) {
    return <AlertBox severity='info' description={t('withdrawConfirmation')} />
  }

  if (applicationWasAlreadyProcessed(application.status) && !!application.statusResolvedDate) {
    return (
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
    )
  }

  return (
    <ApplicationApplicantView
      application={application}
      onWithdraw={() => setIsWithdrawn(true)}
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
    <PublicPageLayout>
      <ApplicationApplicantController providedKey={accessKey} />
    </PublicPageLayout>
  )
}

export default ControllerWithAccessKey
