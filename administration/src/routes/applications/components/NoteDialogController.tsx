import { EditNote } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'urql'

import TextAreaDialog from '../../../components/TextAreaDialog'
import { messageFromGraphQlError } from '../../../errors'
import { UpdateApplicationNoteDocument } from '../../../graphql'
import type { Application } from '../types/types'
import { ApplicationNoteTooltip } from './ApplicationNoteTooltip'

type ApplicationType = Pick<Application, 'id' | 'note'>

type NoteDialogControllerProps = {
  application: ApplicationType
  isOpen: boolean
  onOpenNoteDialog: (value: boolean) => void
  onChange: (application: ApplicationType) => void
}

const NoteDialogController = ({
  application,
  isOpen,
  onOpenNoteDialog,
  onChange,
}: NoteDialogControllerProps): ReactElement => {
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation('applicationsOverview')
  const [updateApplicationState, updateApplicationMutation] = useMutation(
    UpdateApplicationNoteDocument,
  )

  const onClose = () => onOpenNoteDialog(false)

  const onSave = async (text: string) => {
    const result = await updateApplicationMutation({ applicationId: application.id, text })

    if (result.error) {
      const { title } = messageFromGraphQlError(result.error)
      enqueueSnackbar(title, { variant: 'error' })
    } else if (result.data?.success) {
      enqueueSnackbar(t('noteChangedSuccessfully'), {
        variant: 'success',
        autoHideDuration: 2000,
      })
      onChange({ ...application, note: text })
      onOpenNoteDialog(false)
    }
  }

  return (
    <>
      <ApplicationNoteTooltip application={application}>
        <Button
          color={application.note ? 'primary' : 'inherit'}
          variant='contained'
          onClick={() => onOpenNoteDialog(true)}
          startIcon={<EditNote />}
        >
          {application.note ? t('noteButtonShow') : t('noteButtonCreate')}
        </Button>
      </ApplicationNoteTooltip>
      {isOpen && (
        <TextAreaDialog
          defaultText={application.note}
          title={t('noteDialogTitle')}
          isOpen={isOpen}
          maxChars={1000}
          loading={updateApplicationState.fetching}
          onSave={onSave}
          onClose={onClose}
          placeholder={t('applicationNotePlaceholder')}
        />
      )}
    </>
  )
}

export default NoteDialogController
