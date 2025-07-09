import { EditNote } from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useUpdateApplicationNoteMutation } from '../../generated/graphql'
import { useAppToaster } from '../AppToaster'
import TextAreaDialog from '../components/TextAreaDialog'
import { ApplicationNoteTooltip } from './components/ApplicationNoteTooltip'
import { GetApplicationsType } from './types'

type NoteDialogControllerProps = {
  application: GetApplicationsType
  isOpen: boolean
  onOpenNoteDialog: (value: boolean) => void
  onChange: (application: GetApplicationsType) => void
}

const NoteDialogController = ({
  application,
  isOpen,
  onOpenNoteDialog,
  onChange,
}: NoteDialogControllerProps): ReactElement | null => {
  const appToaster = useAppToaster()
  const { t } = useTranslation('applicationsOverview')
  const [updateApplicationNote, { loading }] = useUpdateApplicationNoteMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
    onCompleted: () => {
      appToaster?.show({ intent: 'success', message: t('noteChangedSuccessfully'), timeout: 2000 })
      onOpenNoteDialog(false)
    },
  })

  const onClose = () => onOpenNoteDialog(false)

  const onSave = (text: string) => {
    updateApplicationNote({ variables: { applicationId: application.id, text } }).then(
      result => result.data?.success && onChange({ ...application, note: text })
    )
  }

  return (
    <>
      <ApplicationNoteTooltip application={application}>
        <Button
          variant='contained'
          color='default'
          onClick={() => onOpenNoteDialog(true)}
          startIcon={<EditNote />}
          sx={{ displayPrint: 'none' }}>
          <Typography variant='button'>Notiz anzeigen</Typography>
        </Button>
      </ApplicationNoteTooltip>
      {isOpen && (
        <TextAreaDialog
          defaultText={application.note}
          isOpen={isOpen}
          maxChars={1000}
          loading={loading}
          onSave={onSave}
          onClose={onClose}
          placeholder={t('applicationNotePlaceholder')}
        />
      )}
    </>
  )
}

export default NoteDialogController
