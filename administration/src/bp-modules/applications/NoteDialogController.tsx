import { EditNote } from '@mui/icons-material'
import { Button } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useUpdateApplicationNoteMutation } from '../../generated/graphql'
import { useAppToaster } from '../AppToaster'
import TextAreaDialog from '../components/TextAreaDialog'
import { ApplicationNoteTooltip } from './components/ApplicationNoteTooltip'
import type { Application } from './types'

type NoteDialogControllerProps = {
  application: Application
  isOpen: boolean
  onOpenNoteDialog: (value: boolean) => void
  onChange: (application: Application) => void
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
          color={application.note ? 'primary' : 'default'}
          onClick={() => onOpenNoteDialog(true)}
          startIcon={<EditNote />}>
          {application.note ? t('noteButtonShow') : t('noteButtonCreate')}
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
