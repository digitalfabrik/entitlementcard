import { Button, Dialog, DialogFooter, TextArea } from '@blueprintjs/core'
import React, { ReactElement } from 'react'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useUpdateApplicationNoteMutation } from '../../generated/graphql'
import { useAppToaster } from '../AppToaster'
import { Application } from './ApplicationsOverview'

type NoteProps = {
  noteText: string
  setNoteText: (text: string) => void
  isOpen: boolean
  onOpenNoteDialog: (value: boolean) => void
  application: Application
}

// TODO Update application data after save, move noteText state to NoteDialog

const NoteDialog = ({ isOpen, onOpenNoteDialog, application, noteText, setNoteText }: NoteProps): ReactElement => {
  const appToaster = useAppToaster()
  const [updateApplicationNote, { loading }] = useUpdateApplicationNoteMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
    onCompleted: () => appToaster?.show({ intent: 'success', message: 'Notiz erfolgreich geändert.', timeout: 2000 }),
  })

  const onSave = () => {
    updateApplicationNote({ variables: { applicationId: application.id, text: noteText } })
    onOpenNoteDialog(false)
  }

  return (
    <Dialog isOpen={isOpen} onClose={() => onOpenNoteDialog(false)}>
      <TextArea
        fill={true}
        onChange={e => setNoteText(e.target.value)}
        value={noteText}
        large
        rows={20}
        placeholder={'Fügen Sie hier eine Notiz hinzu...'}
      />
      <DialogFooter
        actions={
          <>
            <Button intent='none' text='Schließen' icon='cross' onClick={() => onOpenNoteDialog(false)} />
            <Button loading={loading} intent='success' text='Speichern' icon='floppy-disk' onClick={onSave} />
          </>
        }
      />
    </Dialog>
  )
}

export default NoteDialog
