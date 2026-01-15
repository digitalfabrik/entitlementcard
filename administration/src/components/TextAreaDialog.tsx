import { Save } from '@mui/icons-material'
import { Stack, TextField } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import AlertBox from '../components/AlertBox'
import graphQlErrorMap from '../errors/graphQlErrorMap'
import { GraphQlExceptionCode } from '../generated/graphql'
import CharacterCounter from './CharacterCounter'
import ConfirmDialog from './ConfirmDialog'

type NoteProps = {
  title: string
  id: string
  placeholder: string
  isOpen: boolean
  onSave: (text: string) => void
  onClose: () => void
  loading: boolean
  defaultText?: string | null
  maxChars?: number
  additionalContent?: ReactElement
}

const TextAreaDialog = ({
  isOpen,
  onSave,
  onClose,
  loading,
  placeholder,
  defaultText,
  maxChars,
  title,
  id,
  additionalContent,
}: NoteProps): ReactElement => {
  const { t } = useTranslation('misc')
  const [text, setText] = useState<string>(defaultText ?? '')
  const maxCharsExceeded = maxChars === undefined ? false : text.length > maxChars
  const { title: errorMessage } = graphQlErrorMap({
    code: GraphQlExceptionCode.InvalidNoteSize,
    maxSize: maxChars,
  })

  return (
    <ConfirmDialog
      open={isOpen}
      title={title}
      id={id}
      maxWidth='md'
      onConfirm={() => onSave(text)}
      onClose={onClose}
      cancelButtonText={t('close')}
      confirmButtonText={t('save')}
      confirmButtonIcon={<Save />}
      actionDisabled={maxCharsExceeded}
      loading={loading}
    >
      <Stack sx={{ gap: 1 }}>
        <TextField
          id='outlined-textarea'
          rows={12}
          fullWidth
          placeholder={placeholder}
          multiline
          value={text}
          onChange={e => setText(e.target.value)}
        />
        {maxChars !== undefined ? <CharacterCounter text={text} maxChars={maxChars} /> : undefined}
        {maxCharsExceeded ? <AlertBox title={errorMessage} severity='error' /> : undefined}
        {additionalContent}
      </Stack>
    </ConfirmDialog>
  )
}

export default TextAreaDialog
