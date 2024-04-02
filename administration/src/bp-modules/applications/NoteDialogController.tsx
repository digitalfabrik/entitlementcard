import { Button, Tooltip } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useGetApplicationByIdQuery, useUpdateApplicationNoteMutation } from '../../generated/graphql'
import getQueryResult from '../../mui-modules/util/getQueryResult'
import { useAppToaster } from '../AppToaster'
import TextAreaDialog from '../components/TextAreaDialog'
import { Application } from './ApplicationsOverview'

const NoteButton = styled(Button)`
  margin-right: 10px;
  align-self: flex-start;
  @media print {
    display: none;
  }
`

const MultilineContent = styled(Tooltip)`
  white-space: pre-wrap;
`

type NoteDialogControllerProps = {
  application: Application
  onOpenNoteDialog: (value: boolean) => void
  isOpen: boolean
}

const EXCERPT_LENGTH = 80

const NoteDialogController = ({ application, onOpenNoteDialog, isOpen }: NoteDialogControllerProps): ReactElement => {
  const appToaster = useAppToaster()
  const [updateApplicationNote, { loading }] = useUpdateApplicationNoteMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
    onCompleted: () => {
      appToaster?.show({ intent: 'success', message: 'Notiz erfolgreich geändert.', timeout: 2000 })
      applicationQuery.refetch({ applicationId: application.id })
    },
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

  const getNoteExcerpt = (maxChars: number, text: string): string =>
    text.length > maxChars ? `${text.slice(0, maxChars)} ...` : text

  const note = applicationQuery.data?.application.note
  const toolTipContent =
    note && note.length > 0 ? <MultilineContent>{getNoteExcerpt(EXCERPT_LENGTH, note)}</MultilineContent> : undefined
  return (
    <>
      <Tooltip content={toolTipContent}>
        <NoteButton onClick={() => onOpenNoteDialog(true)} intent='none' icon='annotation'>
          Notiz anzeigen
        </NoteButton>
      </Tooltip>
      {isOpen && (
        <TextAreaDialog
          defaultText={applicationQuery.data?.application.note}
          isOpen={isOpen}
          maxChars={1000}
          loading={loading}
          onSave={onSave}
          onClose={onClose}
          placeholder={'Fügen Sie hier eine Notiz hinzu...'}
        />
      )}
    </>
  )
}

export default NoteDialogController
