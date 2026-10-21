import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { Temporal } from 'temporal-polyfill'
import { useMutation, useQuery } from 'urql'

import AlertBox from '../../components/AlertBox'
import PublicPageLayout from '../../components/PublicPageLayout'
import { messageFromGraphQlError } from '../../errors'
import {
  ApplicationStatus,
  GetApplicationByVerifierDocument,
  VerifyOrRejectApplicationVerificationDocument,
} from '../../graphql'
import { ProjectConfigContext } from '../../provider/ProjectConfigContext'
import getQueryResult from '../../util/getQueryResult'
import { applicationWasAlreadyProcessed, parseApplication } from '../applications/utils/application'
import ApplicationVerifierView from './ApplicationVerifierView'

type ApplicationVerificationProps = {
  applicationVerificationAccessKey: string
}

const ApplicationVerificationController = ({
  applicationVerificationAccessKey,
}: ApplicationVerificationProps) => {
  const { t } = useTranslation('applicationVerification')
  const [verificationFinished, setVerificationFinished] = useState(false)
  const config = useContext(ProjectConfigContext)
  const { enqueueSnackbar } = useSnackbar()
  const [, verifyOrRejectApplicationVerificationMutation] = useMutation(
    VerifyOrRejectApplicationVerificationDocument,
  )

  const submitApplicationVerification = async (verified: boolean) => {
    const result = await verifyOrRejectApplicationVerificationMutation({
      project: config.projectId,
      accessKey: applicationVerificationAccessKey,
      verified,
    })

    if (result.error) {
      const { title } = messageFromGraphQlError(result.error)
      enqueueSnackbar(title, { variant: 'error' })
    } else if (result.data) {
      if (!result.data.result) {
        console.error('Verify operation returned false.')
        enqueueSnackbar(t('unknown'), { variant: 'error' })
      } else {
        setVerificationFinished(true)
      }
    }
  }

  const [applicationByVerificationState, applicationByVerificationQuery] = useQuery({
    query: GetApplicationByVerifierDocument,
    variables: { applicationVerificationAccessKey },
  })

  const applicationQueryHandler = getQueryResult(
    applicationByVerificationState,
    applicationByVerificationQuery,
  )
  if (!applicationQueryHandler.successful) {
    return applicationQueryHandler.component
  }

  const verification = applicationQueryHandler.data.verification
  const application = parseApplication(applicationQueryHandler.data.application)

  if (verification.rejectedDate || verification.verifiedDate) {
    return <AlertBox severity='info' description={t('alreadyVerified')} />
  }
  if (application.status === ApplicationStatus.Withdrawn && application.statusResolvedDate) {
    return (
      <AlertBox
        severity='info'
        description={t('withdrawMessageForVerifier', {
          date: Temporal.Instant.from(application.statusResolvedDate),
        })}
      />
    )
  }
  if (verificationFinished) {
    return (
      <AlertBox
        title={t('verificationFinishedTitle')}
        description={t('verificationFinishedContent')}
      />
    )
  }

  if (applicationWasAlreadyProcessed(application.status)) {
    return <AlertBox description={t('applicationAlreadyProcessed')} severity='info' />
  }

  return (
    <ApplicationVerifierView
      verification={verification}
      application={application}
      submitApplicationVerification={submitApplicationVerification}
    />
  )
}

const ControllerWithAccessKey = (): ReactElement => {
  const { t } = useTranslation('applicationVerification')
  const { applicationVerificationAccessKey } = useParams()

  return (
    <PublicPageLayout>
      {applicationVerificationAccessKey ? (
        <ApplicationVerificationController
          applicationVerificationAccessKey={applicationVerificationAccessKey}
        />
      ) : (
        <AlertBox
          severity='error'
          title={t('verificationNotFoundTitle')}
          description={t('verificationNotFoundDescription')}
        />
      )}
    </PublicPageLayout>
  )
}

export default ControllerWithAccessKey
