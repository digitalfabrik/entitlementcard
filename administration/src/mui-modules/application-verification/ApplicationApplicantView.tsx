import { Delete } from '@mui/icons-material'
import { Button, Card, CircularProgress, Divider, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useContext, useState } from 'react'

import { Application } from '../../bp-modules/applications/ApplicationsOverview'
import JsonFieldView, { GeneralJsonField } from '../../bp-modules/applications/JsonFieldView'
import VerificationsView from '../../bp-modules/applications/VerificationsView'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useWithdrawApplicationMutation } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import formatDateWithTimezone from '../../util/formatDate'
import getApiBaseUrl from '../../util/getApiBaseUrl'
import ConfirmDialog from '../application/ConfirmDialog'

const ApplicationViewCard = styled(Card)`
  max-width: 800px;
  margin: 10px;
  align-self: center;
`

type ApplicationApplicantViewProps = {
  application: Application
  providedKey: string
  gotWithdrawed: () => void
}

const ApplicationApplicantView = ({
  application,
  providedKey,
  gotWithdrawed,
}: ApplicationApplicantViewProps): ReactElement => {
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
    onCompleted: ({ withdrawed }: { withdrawed: boolean }) => {
      if (withdrawed) gotWithdrawed()
      else {
        console.error('Withdraw operation returned false.')
        enqueueSnackbar('Der Antrag wurde bereits zurückgezogen.', { variant: 'error' })
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

  if (withdrawalLoading) return <CircularProgress style={{ margin: 'auto' }} />

  return (
    <ApplicationViewCard elevation={2}>
      <div style={{ overflow: 'visible', padding: '20px' }}>
        <Typography mb='8px' variant='h6'>
          Ihr Antrag auf die Ehrenamtskarte Bayern vom {formatDateWithTimezone(createdDateString, config.timezone)}
        </Typography>
        <JsonFieldView
          jsonField={jsonField}
          baseUrl={baseUrl}
          key={0}
          hierarchyIndex={0}
          attachmentAccessible={false}
          expandedRoot={false}
        />
        <Divider style={{ margin: '24px 0px' }} />
        <VerificationsView verifications={application.verifications} />
        {!application.withdrawalDate && (
          <>
            <Divider style={{ margin: '24px 0px' }} />
            <Typography mt='8px' mb='16px' variant='body2'>
              Hier können Sie Ihren Antrag zurückziehen und Ihre Eingaben unwiderruflich löschen.
            </Typography>
            <Button variant='contained' endIcon={<Delete />} onClick={() => setDialogOpen(true)}>
              Antrag zurückziehen
            </Button>
            <ConfirmDialog
              open={dialogOpen}
              onUpdateOpen={setDialogOpen}
              title='Antrag zurückziehen?'
              content='Möchten Sie den Antrag zurückziehen?'
              onConfirm={submitWithdrawal}
            />
          </>
        )}
      </div>
    </ApplicationViewCard>
  )
}

export default ApplicationApplicantView
