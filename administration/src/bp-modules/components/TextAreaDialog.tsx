import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Close, Save } from '@mui/icons-material'
import { Button, Stack, TextField } from '@mui/material'
import graphQlErrorMap from '../../errors/GraphQlErrorMap'
import { GraphQlExceptionCode } from '../../generated/graphql'
import AlertBox from '../../mui-modules/base/AlertBox'
import CharacterCounter from './CharacterCounter'
import CustomDialog from './CustomDialog'

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
    <CustomDialog
      fullWidth
      open={isOpen}
      onCancelAction={
        <Button variant='outlined' color='default.dark' startIcon={<Close />} onClick={onClose}>
          {t('close')}
        </Button>
      }
      title={title}
      id={id}
      onConfirmAction={
        <Button
          disabled={maxCharsExceeded}
          loading={loading}
          variant='contained'
          startIcon={<Save />}
          onClick={() => onSave(text)}>
          {' '}
          {t('save')}
        </Button>
      }
      onClose={onClose}>
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
    </CustomDialog>
  )
}

export default TextAreaDialog
