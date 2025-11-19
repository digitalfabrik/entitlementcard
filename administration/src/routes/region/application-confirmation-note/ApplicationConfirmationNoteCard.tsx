import { Button, Typography } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import SettingsCard, { SettingsCardButtonBox } from '../../../shared/components/SettingsCard'
import ApplicationConfirmationNote from './ApplicationConfirmationNote'

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
    <SettingsCard title={t('applicationConfirmationMailNoteHeadline')}>
      <Typography component='p'>{t('applicationConfirmationMailNoteExplanation')}</Typography>
      <SettingsCardButtonBox>
        <Button onClick={() => setOpenApplicationConfirmationNote(true)}>{t('open')}</Button>
      </SettingsCardButtonBox>
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
