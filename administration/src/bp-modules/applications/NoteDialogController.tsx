import React, { ReactElement } from 'react'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useGetApplicationByIdQuery, useUpdateApplicationNoteMutation } from '../../generated/graphql'
import getQueryResult from '../../mui-modules/util/getQueryResult'
import { useAppToaster } from '../AppToaster'
import TextAreaDialog from '../components/TextAreaDialog'
import { Application } from './ApplicationsOverview'

type NoteDialogControllerProps = {
  application: Application
  onOpenNoteDialog: (value: boolean) => void
  isOpen: boolean
}

const NoteDialogController = ({ application, onOpenNoteDialog, isOpen }: NoteDialogControllerProps): ReactElement => {
  const appToaster = useAppToaster()
  const [updateApplicationNote, { loading }] = useUpdateApplicationNoteMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
    onCompleted: () => appToaster?.show({ intent: 'success', message: 'Notiz erfolgreich geändert.', timeout: 2000 }),
  })
  const applicationQuery = useGetApplicationByIdQuery({
    variables: { applicationId: application.id },
  })
  const applicationQueryHandler = getQueryResult(applicationQuery)
  if (!applicationQueryHandler.successful) return applicationQueryHandler.component

  const onClose = () => onOpenNoteDialog(false)

  const onSave = (text: string) => {
    updateApplicationNote({ variables: { applicationId: application.id, text } })
    onOpenNoteDialog(false)
  }

  return (
    <TextAreaDialog
      onSave={onSave}
      onClose={onClose}
      loading={loading}
      defaultText={applicationQuery.data?.application.note}
      placeholder={'Fügen Sie hier eine Notiz hinzu...'}
      isOpen={isOpen}
    />
  )
}

export default NoteDialogController
