import { SnackbarProvider, useSnackbar } from 'notistack'
import React, { ReactElement, useContext, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import {
  ApplicationStatus,
  useGetApplicationByApplicationVerificationAccessKeyQuery,
  useVerifyOrRejectApplicationVerificationMutation,
} from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { applicationWasAlreadyProcessed, parseApplication } from '../../shared/application'
import formatDateWithTimezone from '../../util/formatDate'
import AlertBox from '../base/AlertBox'
import CenteredStack from '../base/CenteredStack'
import getQueryResult from '../util/getQueryResult'
import ApplicationVerifierView from './ApplicationVerifierView'

type ApplicationVerificationProps = {
  applicationVerificationAccessKey: string
}

const ApplicationVerificationController = ({ applicationVerificationAccessKey }: ApplicationVerificationProps) => {
  const { t } = useTranslation('applicationVerification')
  const [verificationFinished, setVerificationFinished] = useState(false)
  const config = useContext(ProjectConfigContext)
  const { enqueueSnackbar } = useSnackbar()
  const [verifyOrRejectApplicationVerification] = useVerifyOrRejectApplicationVerificationMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      enqueueSnackbar(title, { variant: 'error' })
    },
    onCompleted: ({ result }) => {
      if (!result) {
        console.error('Verify operation returned false.')
        enqueueSnackbar(t('unknown'), { variant: 'error' })
      } else {
        setVerificationFinished(true)
      }
    },
  })

  const submitApplicationVerification = (verified: boolean) => {
    verifyOrRejectApplicationVerification({
      variables: {
        project: config.projectId,
        accessKey: applicationVerificationAccessKey,
        verified,
      },
    })
  }

  const applicationQuery = useGetApplicationByApplicationVerificationAccessKeyQuery({
    variables: { applicationVerificationAccessKey },
  })

  const applicationQueryHandler = getQueryResult(applicationQuery)
  if (!applicationQueryHandler.successful) {
    return applicationQueryHandler.component
  }

  const verification = applicationQueryHandler.data.verification
  const application = parseApplication(applicationQueryHandler.data.application)

  if (verification.rejectedDate || verification.verifiedDate) {
    return (
      <CenteredStack>
        <AlertBox severity='info' description={t('alreadyVerified')} />
      </CenteredStack>
    )
  }
  if (application.status === ApplicationStatus.Withdrawn && application.statusResolvedDate) {
    return (
      <CenteredStack>
        <AlertBox
          severity='info'
          description={t('withdrawMessageForVerifier', {
            date: formatDateWithTimezone(application.statusResolvedDate, config.timezone),
          })}
        />
      </CenteredStack>
    )
  }
  if (verificationFinished) {
    return (
      <CenteredStack>
        <AlertBox title={t('verificationFinishedTitle')} description={t('verificationFinishedContent')} />
      </CenteredStack>
    )
  }

  if (applicationWasAlreadyProcessed(application.status)) {
    return (
      <CenteredStack>
        <AlertBox
          title={t('applicationAlreadyProcessed')}
          description={<Trans i18nKey='applicationVerification:applicationAlreadyProcessedHint' />}
          severity='info'
        />
      </CenteredStack>
    )
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

  if (!applicationVerificationAccessKey) {
    return (
      <AlertBox
        severity='error'
        title={t('verificationNotFoundTitle')}
        description={t('verificationNotFoundDescription')}
      />
    )
  }

  return (
    <SnackbarProvider>
      <ApplicationVerificationController applicationVerificationAccessKey={applicationVerificationAccessKey} />
    </SnackbarProvider>
  )
}

export default ControllerWithAccessKey
