import { Button, Dialog, DialogFooter, TextArea } from '@blueprintjs/core'
import React, { ReactElement, useState } from 'react'

type NoteProps = {
  placeholder: string
  isOpen: boolean
  onSave: (text: string) => void
  onClose: () => void
  loading: boolean
  defaultText?: string | null
}

const TextAreaDialog = ({ isOpen, onSave, onClose, loading, placeholder, defaultText }: NoteProps): ReactElement => {
  const [text, setText] = useState<string>(defaultText ?? '')

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <TextArea
        fill={true}
        onChange={e => setText(e.target.value)}
        value={text}
        large
        rows={20}
        placeholder={placeholder}
      />
      <DialogFooter
        actions={
          <>
            <Button intent='none' text='Schließen' icon='cross' onClick={onClose} />
            <Button
              loading={loading}
              intent='success'
              text='Speichern'
              icon='floppy-disk'
              onClick={() => onSave(text)}
            />
          </>
        }
      />
    </Dialog>
  )
}

export default TextAreaDialog
