import { Delete } from '@mui/icons-material'
import { Button, Card, CircularProgress, Divider, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import JsonFieldView, { GeneralJsonField } from '../../bp-modules/applications/JsonFieldView'
import VerificationsView from '../../bp-modules/applications/VerificationsView'
import { GetApplicationsType } from '../../bp-modules/applications/types'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useWithdrawApplicationMutation } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import formatDateWithTimezone from '../../util/formatDate'
import getApiBaseUrl from '../../util/getApiBaseUrl'
import ConfirmDialog from '../application/ConfirmDialog'

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

type ApplicationApplicantViewProps = {
  application: GetApplicationsType
  providedKey: string
  gotWithdrawn: () => void
}

const ApplicationApplicantView = ({
  application,
  providedKey,
  gotWithdrawn,
}: ApplicationApplicantViewProps): ReactElement => {
  const { t } = useTranslation('applicationApplicant')
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const { createdDate: createdDateString, jsonValue, id } = application
  const jsonField: GeneralJsonField = JSON.parse(jsonValue)
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
        gotWithdrawn()
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

  if (withdrawalLoading) {
    return <CircularProgress style={{ margin: 'auto' }} />
  }

  return (
    <ApplicationViewCard elevation={2}>
      <ApplicationViewCardContent>
        <Typography sx={{ mb: '8px' }} variant='h6'>
          {`${t('headline')} ${formatDateWithTimezone(createdDateString, config.timezone)}`}
        </Typography>
        <JsonFieldView
          jsonField={jsonField}
          baseUrl={baseUrl}
          key={0}
          hierarchyIndex={0}
          attachmentAccessible={false}
          expandedRoot={false}
        />
        <StyledDivider />
        <VerificationsView application={application} showResendApprovalEmailButton={false}/>
        {!application.withdrawalDate && (
          <>
            <StyledDivider />
            <Typography sx={{ mt: '8px', mb: '16px' }} variant='body2'>
              {t('withdrawInformation')}
            </Typography>
            <Button variant='contained' endIcon={<Delete />} onClick={() => setDialogOpen(true)}>
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
