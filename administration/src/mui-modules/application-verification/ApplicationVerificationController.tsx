import { Check, Close } from '@mui/icons-material'
import { Alert, Button, Card, Divider, Typography, styled } from '@mui/material'
import { SnackbarProvider, useSnackbar } from 'notistack'
import React, { ReactElement, useContext, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import JsonFieldView from '../../bp-modules/applications/JsonFieldView'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import {
  ApplicationStatus,
  useGetApplicationByApplicationVerificationAccessKeyQuery,
  useVerifyOrRejectApplicationVerificationMutation,
} from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { parseApplication } from '../../shared/application'
import formatDateWithTimezone from '../../util/formatDate'
import getApiBaseUrl from '../../util/getApiBaseUrl'
import AlertBox from '../base/AlertBox'
import getQueryResult from '../util/getQueryResult'

const ApplicationViewCard = styled(Card)`
  max-width: 800px;
  margin: 10px;
  align-self: center;
`

const StyledAlert = styled(Alert)`
  margin: 20px 0;
`

const ButtonContainer = styled('div')`
  display: flex;
  width: inherit;
  flex-direction: row;
  justify-content: space-around;
`

type ApplicationVerificationProps = {
  applicationVerificationAccessKey: string
}

const ApplicationVerification = ({ applicationVerificationAccessKey }: ApplicationVerificationProps) => {
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
    return <AlertBox severity='info' description={t('alreadyVerified')} />
  }
  if (application.status === ApplicationStatus.Withdrawn && application.statusResolvedDate) {
    return (
      <AlertBox
        severity='info'
        description={t('withdrawMessageForVerifier', {
          date: formatDateWithTimezone(application.statusResolvedDate, config.timezone),
        })}
      />
    )
  }
  if (verificationFinished) {
    return <AlertBox title={t('verificationFinishedTitle')} description={t('verificationFinishedContent')} />
  }

  const { createdDate: createdDateString, id } = application
  const baseUrl = `${getApiBaseUrl()}/application/${config.projectId}/${id}`

  return (
    <ApplicationViewCard elevation={2}>
      <div style={{ overflow: 'visible', padding: '20px' }}>
        <Typography sx={{ mb: '12px' }} variant='h4'>
          {config.name}
        </Typography>
        <Typography sx={{ my: '8px' }} variant='body1'>
          {t('greeting', { contactName: verification.contactName })}
          <br />
          <br />
          <Trans i18nKey='applicationVerification:text' values={{ organizationName: verification.organizationName }} />
        </Typography>
        <Divider style={{ margin: '24px 0px' }} />
        <Typography variant='h6' sx={{ mb: '8px' }}>
          Antrag vom {formatDateWithTimezone(createdDateString, config.timezone)}
        </Typography>
        <JsonFieldView
          jsonField={application.jsonValue}
          baseUrl={baseUrl}
          hierarchyIndex={0}
          attachmentAccessible={false}
          expandedRoot
        />
        <Divider style={{ margin: '24px 0px' }} />
        <Typography sx={{ mt: '8px' }} variant='body1'>
          <Trans
            i18nKey='applicationVerification:confirmationMessage'
            values={{ organizationName: verification.organizationName }}
          />
        </Typography>
        <StyledAlert severity='warning'>
          <Trans i18nKey='applicationVerification:confirmationNote' />
        </StyledAlert>
        <ButtonContainer>
          <Button
            variant='contained'
            color='error'
            endIcon={<Close />}
            onClick={() => submitApplicationVerification(false)}>
            {t('rejectButton')}
          </Button>
          <Button
            variant='contained'
            color='success'
            endIcon={<Check />}
            onClick={() => submitApplicationVerification(true)}>
            {t('confirmationButton')}
          </Button>
        </ButtonContainer>
      </div>
    </ApplicationViewCard>
  )
}

const ApplicationVerificationController = (): ReactElement => {
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
      <ApplicationVerification applicationVerificationAccessKey={applicationVerificationAccessKey} />
    </SnackbarProvider>
  )
}

export default ApplicationVerificationController
