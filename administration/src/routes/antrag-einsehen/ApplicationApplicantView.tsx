import { Delete } from '@mui/icons-material'
import { Button, Card, Divider, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CenteredCircularProgress from '../../components/CenteredCircularProgress'
import ConfirmDialog from '../../components/ConfirmDialog'
import JsonFieldView from '../../components/JsonFieldView'
import VerificationsView from '../../components/VerificationsView'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import {
  ApplicationStatus,
  GetApplicationByApplicantQuery,
  useWithdrawApplicationMutation,
} from '../../generated/graphql'
import { ProjectConfigContext } from '../../provider/ProjectConfigContext'
import formatDateWithTimezone from '../../util/formatDate'
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
  const { createdDate: createdDateString, id } = application
  const config = useContext(ProjectConfigContext)
  const baseUrl = `${getApiBaseUrl()}/application/${config.projectId}/${id}`
  const { enqueueSnackbar } = useSnackbar()
  const [withdrawApplication, { loading: withdrawalLoading }] = useWithdrawApplicationMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      enqueueSnackbar(title, { variant: 'error' })
    },
    onCompleted: () => onWithdraw(),
  })
  const submitWithdrawal = () => {
    withdrawApplication({
      variables: {
        accessKey: providedKey,
      },
    })
  }

  return withdrawalLoading ? (
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
        <Typography> {t('withdrawConfirmationContent')}</Typography>
      </ConfirmDialog>

      <ApplicationViewCard elevation={2}>
        <ApplicationViewCardContent>
          <Typography marginBottom={1} variant='h6'>
            {`${t('headline')} ${formatDateWithTimezone(createdDateString, config.timezone)}`}
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
