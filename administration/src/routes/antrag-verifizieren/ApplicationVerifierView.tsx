import { Check, Close } from '@mui/icons-material'
import { Alert, Button, Card, Divider, Typography, styled } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Temporal } from 'temporal-polyfill'

import JsonFieldView from '../../components/JsonFieldView'
import PageLayout from '../../components/PageLayout'
import { GetApplicationByApplicantQuery } from '../../graphql'
import { ProjectConfigContext } from '../../provider/ProjectConfigContext'
import getApiBaseUrl from '../../util/getApiBaseUrl'
import { ApplicationVerificationPublic } from '../applications/types/types'
import { ApplicationWithoutVerifications } from '../applications/utils/application'

const ApplicationViewCard = styled(Card)`
  max-width: 800px;
  margin: 16px auto 16px auto;
`

const StyledAlert = styled(Alert)`
  margin: 20px 0;
  background-color: transparent;
`

const ButtonContainer = styled('div')`
  display: flex;
  width: inherit;
  flex-direction: row;
  justify-content: space-around;
`

type ApplicationVerificantViewProps = {
  application: ApplicationWithoutVerifications<GetApplicationByApplicantQuery['application']>
  verification: ApplicationVerificationPublic
  submitApplicationVerification: (verified: boolean) => void
}

const ApplicationVerifierView = ({
  application,
  submitApplicationVerification,
  verification,
}: ApplicationVerificantViewProps): ReactElement => {
  const config = useContext(ProjectConfigContext)
  const { t } = useTranslation('applicationVerification')
  const baseUrl = `${getApiBaseUrl()}/application/${config.projectId}/${application.id}`
  return (
    <PageLayout>
      <ApplicationViewCard elevation={2}>
        <div style={{ overflow: 'visible', padding: '20px' }}>
          <Typography sx={{ mb: 1.5 }} variant='h4'>
            {config.name}
          </Typography>
          <Typography sx={{ marginY: 1 }} variant='body1'>
            {t('greeting', { contactName: verification.contactName })}
            <br />
            <br />
            <Trans
              i18nKey='applicationVerification:text'
              values={{ organizationName: verification.organizationName }}
            />
          </Typography>
          <Divider style={{ margin: '24px 0px' }} />
          <Typography variant='h6' sx={{ mb: 1 }}>
            {t('info', { date: Temporal.Instant.from(application.createdDate) })}
          </Typography>
          <JsonFieldView
            jsonField={application.jsonValue}
            baseUrl={baseUrl}
            hierarchyIndex={0}
            attachmentAccessible={false}
            expandedRoot
          />
          <Divider style={{ margin: '24px 0px' }} />

          <Typography sx={{ mt: 1 }} variant='body1'>
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
              onClick={() => submitApplicationVerification(false)}
            >
              {t('rejectButton')}
            </Button>
            <Button
              variant='contained'
              color='success'
              endIcon={<Check />}
              onClick={() => submitApplicationVerification(true)}
            >
              {t('confirmationButton')}
            </Button>
          </ButtonContainer>
        </div>
      </ApplicationViewCard>
    </PageLayout>
  )
}

export default ApplicationVerifierView
