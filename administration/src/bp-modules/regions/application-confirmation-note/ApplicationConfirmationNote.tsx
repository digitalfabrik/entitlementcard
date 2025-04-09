import { Checkbox } from '@blueprintjs/core'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import TextAreaDialog from '../../components/TextAreaDialog'

const StyledCheckbox = styled(Checkbox)`
  margin: 12px;
`

type ApplicationConfirmationNoteDialogProps = {
  defaultConfirmationNote?: string | null
  defaultConfirmationNoteActivated: boolean
  isOpen: boolean
  isSavingApplicationConfirmationNote: boolean
  setIsOpen: (value: boolean) => void
  saveApplicationConfirmationNote: (text: string, activated: boolean) => void
}

const MAX_NOTE_CHARS = 1000
const ApplicationConfirmationNoteDialog = ({
  isOpen,
  isSavingApplicationConfirmationNote,
  defaultConfirmationNoteActivated,
  defaultConfirmationNote,
  setIsOpen,
  saveApplicationConfirmationNote,
}: ApplicationConfirmationNoteDialogProps): ReactElement => {
  const [applicationConfirmationNoteActivated, setApplicationConfirmationNoteActivated] = useState(
    defaultConfirmationNoteActivated
  )
  const { t } = useTranslation('regionSettings')

  const onSave = (text: string) => {
    saveApplicationConfirmationNote(text, applicationConfirmationNoteActivated)
  }

  const additionalContent = (
    <StyledCheckbox
      checked={applicationConfirmationNoteActivated}
      onChange={e => setApplicationConfirmationNoteActivated(e.currentTarget.checked)}
      label={t('applicationConfirmationMailNoteActivated')}
    />
  )

  return (
    <TextAreaDialog
      defaultText={defaultConfirmationNote}
      maxChars={MAX_NOTE_CHARS}
      placeholder={t('applicationConfirmationMailNoteDialogPlaceholder')}
      isOpen={isOpen}
      onSave={onSave}
      onClose={() => setIsOpen(false)}
      loading={isSavingApplicationConfirmationNote}
      additionalContent={additionalContent}
    />
  )
}

export default ApplicationConfirmationNoteDialog
