import { Button, H2 } from '@blueprintjs/core'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import SettingsCard from '../../user-settings/SettingsCard'
import ApplicationConfirmationNote from './ApplicationConfirmationNote'

const ButtonContainer = styled.div`
  text-align: right;
  padding: 8px 0;
`

type ApplicationConfirmationNoteCardProps = {
  defaultConfirmationNote: string | null | undefined
  defaultConfirmationNoteActivated: boolean
  saveApplicationConfirmationNote: (text: string, activated: boolean) => void
  isSavingApplicationConfirmationNote: boolean
}

const ApplicationConfirmationNoteCard = ({
  saveApplicationConfirmationNote,
  defaultConfirmationNote,
  defaultConfirmationNoteActivated,
  isSavingApplicationConfirmationNote,
}: ApplicationConfirmationNoteCardProps): ReactElement => {
  const [openApplicationConfirmationNote, setOpenApplicationConfirmationNote] = useState(false)
  const { t } = useTranslation('regionSettings')

  return (
    <SettingsCard>
      <H2>{t('applicationConfirmationMailNoteHeadline')}</H2>
      <p>{t('applicationConfirmationMailNoteExplanation')}</p>
      <ButtonContainer>
        <Button text={t('open')} intent='primary' onClick={() => setOpenApplicationConfirmationNote(true)} />
      </ButtonContainer>
      {openApplicationConfirmationNote && (
        <ApplicationConfirmationNote
          saveApplicationConfirmationNote={saveApplicationConfirmationNote}
          setIsOpen={setOpenApplicationConfirmationNote}
          isOpen={openApplicationConfirmationNote}
          defaultConfirmationNote={defaultConfirmationNote}
          defaultConfirmationNoteActivated={defaultConfirmationNoteActivated}
          isSavingApplicationConfirmationNote={isSavingApplicationConfirmationNote}
        />
      )}
    </SettingsCard>
  )
}

export default ApplicationConfirmationNoteCard
