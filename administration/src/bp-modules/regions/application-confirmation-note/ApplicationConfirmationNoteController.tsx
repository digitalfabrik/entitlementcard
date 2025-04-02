import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import getMessageFromApolloError from '../../../errors/getMessageFromApolloError'
import {
  useGetApplicationConfirmationNoteInformationQuery,
  useUpdateApplicationConfirmationNoteMutation,
} from '../../../generated/graphql'
import { useAppToaster } from '../../AppToaster'
import getQueryResult from '../../util/getQueryResult'
import ApplicationConfirmationNoteCard from './ApplicationConfirmationNoteCard'

type ApplicationConfirmationNoteControllerProps = {
  regionId: number
}

const ApplicationConfirmationNoteController = ({
  regionId,
}: ApplicationConfirmationNoteControllerProps): ReactElement => {
  const appToaster = useAppToaster()
  const { t } = useTranslation('regionSettings')
  const applicationConfirmationNoteQuery = useGetApplicationConfirmationNoteInformationQuery({
    variables: { regionId },
  })

  const [updateApplicationConfirmationNote, { loading }] = useUpdateApplicationConfirmationNoteMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
    onCompleted: () => {
      appToaster?.show({ intent: 'success', message: t('applicationConfirmationMailNoteSavedSuccessful') })
      applicationConfirmationNoteQuery.refetch({ regionId })
    },
  })

  const applicationConfirmationNoteQueryResult = getQueryResult(applicationConfirmationNoteQuery)
  if (!applicationConfirmationNoteQueryResult.successful) {
    return applicationConfirmationNoteQueryResult.component
  }

  const { applicationConfirmationMailNote, applicationConfirmationMailNoteActivated } =
    applicationConfirmationNoteQueryResult.data.region

  const saveApplicationConfirmationNote = (note: string, activated: boolean) => {
    updateApplicationConfirmationNote({
      variables: {
        regionId,
        note,
        activated,
      },
    })
  }

  return (
    <ApplicationConfirmationNoteCard
      defaultConfirmationNote={applicationConfirmationMailNote}
      defaultConfirmationNoteActivated={applicationConfirmationMailNoteActivated}
      saveApplicationConfirmationNote={saveApplicationConfirmationNote}
      loadingSaveApplicationConfirmationNote={loading}
    />
  )
}

export default ApplicationConfirmationNoteController
