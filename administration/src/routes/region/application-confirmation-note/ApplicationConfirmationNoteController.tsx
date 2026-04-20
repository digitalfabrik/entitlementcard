import { useSnackbar } from 'notistack'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'urql'

import { messageFromGraphQlError } from '../../../errors'
import {
  GetApplicationConfirmationNoteInformationDocument,
  UpdateApplicationConfirmationNoteDocument,
} from '../../../graphql'
import getQueryResult from '../../../util/getQueryResult'
import ApplicationConfirmationNoteCard from './ApplicationConfirmationNoteCard'

type ApplicationConfirmationNoteControllerProps = {
  regionId: number
}

const ApplicationConfirmationNoteController = ({
  regionId,
}: ApplicationConfirmationNoteControllerProps): ReactElement => {
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation('regionSettings')
  const [applicationConfirmationNoteState, applicationConfirmationNoteQuery] = useQuery({
    query: GetApplicationConfirmationNoteInformationDocument,
    variables: { regionId },
  })

  const [updateApplicationNoteState, updateApplicationNoteMutation] = useMutation(
    UpdateApplicationConfirmationNoteDocument,
  )
  const applicationConfirmationNoteQueryResult = getQueryResult(
    applicationConfirmationNoteState,
    applicationConfirmationNoteQuery,
  )

  if (!applicationConfirmationNoteQueryResult.successful) {
    return applicationConfirmationNoteQueryResult.component
  }

  const { applicationConfirmationMailNote, applicationConfirmationMailNoteActivated } =
    applicationConfirmationNoteQueryResult.data.region

  const saveApplicationConfirmationNote = async (note: string, activated: boolean) => {
    const result = await updateApplicationNoteMutation({
      regionId,
      note,
      activated,
    })

    if (result.error) {
      const { title } = messageFromGraphQlError(result.error)
      enqueueSnackbar(title, { variant: 'error' })
    } else {
      enqueueSnackbar(t('applicationConfirmationMailNoteSavedSuccessful'), { variant: 'success' })
      applicationConfirmationNoteQuery({ requestPolicy: 'network-only' })
    }
  }

  return (
    <ApplicationConfirmationNoteCard
      defaultConfirmationNote={applicationConfirmationMailNote}
      defaultConfirmationNoteActivated={applicationConfirmationMailNoteActivated}
      saveApplicationConfirmationNote={saveApplicationConfirmationNote}
      isSavingApplicationConfirmationNote={updateApplicationNoteState.fetching}
    />
  )
}

export default ApplicationConfirmationNoteController
