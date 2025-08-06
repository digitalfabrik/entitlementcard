import { Delete } from '@mui/icons-material'
import { Button, Card, Divider, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import {
  ApplicationStatus,
  GetApplicationByApplicantQuery,
  useWithdrawApplicationMutation,
} from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { ApplicationParsedJsonValue } from '../../shared/application'
import JsonFieldView from '../../shared/components/JsonFieldView'
import VerificationsView from '../../shared/components/VerificationsView'
import formatDateWithTimezone from '../../util/formatDate'
import getApiBaseUrl from '../../util/getApiBaseUrl'
import ConfirmDialog from '../application/ConfirmDialog'
import CenteredCircularProgress from '../base/CenteredCircularProgress'

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
    onCompleted: ({ isWithdrawn }: { isWithdrawn: boolean }) => {
      if (isWithdrawn) {
        onWithdraw()
      } else {
        console.error('Withdraw operation returned false.')
        enqueueSnackbar(t('alreadyWithdrawn'), { variant: 'error' })
      }
    },
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
    <ApplicationViewCard elevation={2}>
      <ApplicationViewCardContent>
        <Typography sx={{ mb: '8px' }} variant='h6'>
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
            <Typography sx={{ mt: '8px', mb: '16px' }} variant='body2'>
              {t('withdrawInformation')}
            </Typography>
            <Button variant='contained' startIcon={<Delete />} onClick={() => setDialogOpen(true)}>
              {t('withdrawApplication')}
            </Button>
            <ConfirmDialog
              open={dialogOpen}
              onUpdateOpen={setDialogOpen}
              title={t('withdrawConfirmationTitle')}
              content={t('withdrawConfirmationContent')}
              onConfirm={submitWithdrawal}
            />
          </>
        )}
      </ApplicationViewCardContent>
    </ApplicationViewCard>
  )
}

export default ApplicationApplicantView
