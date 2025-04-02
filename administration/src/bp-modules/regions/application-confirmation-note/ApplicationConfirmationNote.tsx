import { Button, Checkbox, TextArea } from '@blueprintjs/core'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import BasicDialog from '../../../mui-modules/application/BasicDialog'
import CharacterCounter from '../../components/CharacterCounter'

const StyledTextArea = styled(TextArea)`
  min-width: 50vw;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ButtonContainer = styled.div`
  text-align: right;
`

type ApplicationConfirmationNoteDialogProps = {
  defaultConfirmationNote: string | null | undefined
  defaultConfirmationNoteActivated: boolean
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  saveApplicationConfirmationNote: (text: string, activated: boolean) => void
}

const MAX_NOTE_CHARS = 1000
const ApplicationConfirmationNoteDialog = ({
  isOpen,
  defaultConfirmationNote,
  defaultConfirmationNoteActivated,
  setIsOpen,
  saveApplicationConfirmationNote,
}: ApplicationConfirmationNoteDialogProps): ReactElement => {
  const [applicationConfirmationNote, setApplicationConfirmationNote] = useState(defaultConfirmationNote ?? '')
  const [applicationConfirmationNoteActivated, setApplicationConfirmationNoteActivated] = useState(
    defaultConfirmationNoteActivated
  )
  const { t } = useTranslation('regionSettings')
  const maxCharsExceeded = applicationConfirmationNote.length > MAX_NOTE_CHARS
  return (
    <BasicDialog
      open={isOpen}
      maxWidth='lg'
      onUpdateOpen={setIsOpen}
      title={t('applicationConfirmationMailNoteDialogHeadline')}
      content={
        <Content>
          <StyledTextArea
            fill
            onChange={e => setApplicationConfirmationNote(e.target.value)}
            value={applicationConfirmationNote}
            large
            rows={12}
            placeholder={t('applicationConfirmationMailNoteDialogPlaceholder')}
          />
          <CharacterCounter text={applicationConfirmationNote} maxChars={MAX_NOTE_CHARS} />
          <Checkbox
            checked={applicationConfirmationNoteActivated}
            onChange={e => setApplicationConfirmationNoteActivated(e.currentTarget.checked)}
            label={t('applicationConfirmationMailNoteActivated')}
          />
          <ButtonContainer>
            <Button
              text={t('misc:save')}
              disabled={maxCharsExceeded}
              intent='primary'
              onClick={() =>
                saveApplicationConfirmationNote(applicationConfirmationNote, applicationConfirmationNoteActivated)
              }
            />
          </ButtonContainer>
        </Content>
      }
    />
  )
}

export default ApplicationConfirmationNoteDialog
