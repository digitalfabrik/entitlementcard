import { Delete } from '@mui/icons-material'
import { Button, Card, Divider, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Temporal } from 'temporal-polyfill'
import { useMutation } from 'urql'

import CenteredCircularProgress from '../../components/CenteredCircularProgress'
import ConfirmDialog from '../../components/ConfirmDialog'
import JsonFieldView from '../../components/JsonFieldView'
import VerificationsView from '../../components/VerificationsView'
import { messageFromGraphQlError } from '../../errors'
import {
  ApplicationStatus,
  GetApplicationByApplicantQuery,
  WithdrawApplicationDocument,
} from '../../graphql'
import { ProjectConfigContext } from '../../provider/ProjectConfigContext'
import getApiBaseUrl from '../../util/getApiBaseUrl'
import { ApplicationParsedJsonValue } from '../applications/utils/application'

const ApplicationViewCard = styled(Card)`
  @media screen and (min-width: 600px) {
    width: 60vw;
  }
  margin: 10px;
  align-self: center;
`

const ApplicationViewCardContent = styled('div')`
  overflow: visible;
  padding: 20px;
`

const StyledDivider = styled(Divider)`
  margin: 24px 0;
`

const ApplicationApplicantView = ({
  application,
  providedKey,
  onWithdraw,
}: {
  application: ApplicationParsedJsonValue<GetApplicationByApplicantQuery['application']>
  providedKey: string
  onWithdraw: () => void
}): ReactElement => {
  const { t } = useTranslation('applicationApplicant')
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const config = useContext(ProjectConfigContext)
  const baseUrl = `${getApiBaseUrl()}/application/${config.projectId}/${application.id}`
  const { enqueueSnackbar } = useSnackbar()
  const [withdrawApplicationState, withdrawApplicationMutation] = useMutation(
    WithdrawApplicationDocument,
  )

  const submitWithdrawal = async () => {
    const result = await withdrawApplicationMutation({
      accessKey: providedKey,
    })
    if (result.error) {
      const { title } = messageFromGraphQlError(result.error)
      enqueueSnackbar(title, { variant: 'error' })
    } else {
      onWithdraw()
    }
  }

  return withdrawApplicationState.fetching ? (
    <CenteredCircularProgress />
  ) : (
    <>
      <ConfirmDialog
        open={dialogOpen}
        maxWidth='xs'
        onClose={() => setDialogOpen(false)}
        title={t('withdrawConfirmationTitle')}
        onConfirm={submitWithdrawal}
      >
        <Typography>{t('withdrawConfirmationContent')}</Typography>
      </ConfirmDialog>

      <ApplicationViewCard elevation={2}>
        <ApplicationViewCardContent>
          <Typography marginBottom={1} variant='h6'>
            {t('headline', { date: Temporal.Instant.from(application.createdDate) })}
          </Typography>
          <JsonFieldView
            jsonField={application.jsonValue}
            baseUrl={baseUrl}
            key={0}
            hierarchyIndex={0}
            attachmentAccessible={false}
            expandedRoot={false}
          />
          <StyledDivider />
          <VerificationsView application={application} />
          {application.status === ApplicationStatus.Pending && (
            <>
              <StyledDivider />
              <Typography marginTop={1} marginBottom={2}>
                {t('withdrawInformation')}
              </Typography>
              <Button
                variant='contained'
                startIcon={<Delete />}
                onClick={() => setDialogOpen(true)}
              >
                {t('withdrawApplication')}
              </Button>
            </>
          )}
        </ApplicationViewCardContent>
      </ApplicationViewCard>
    </>
  )
}

export default ApplicationApplicantView
