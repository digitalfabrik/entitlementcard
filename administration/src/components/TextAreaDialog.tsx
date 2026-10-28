import { Save } from '@mui/icons-material'
import { Box, Stack, Tab, Tabs, TextField, Typography } from '@mui/material'
import { ReactElement, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'

import AlertBox from '../components/AlertBox'
import { graphQlErrorMap } from '../errors'
import { GraphQlExceptionCode } from '../graphql'
import CharacterCounter from './CharacterCounter'
import ConfirmDialog from './ConfirmDialog'

type NoteProps = {
  title: string
  description?: string
  placeholder: string
  isOpen: boolean
  onSave: (text: string) => void
  onClose: () => void
  loading: boolean
  defaultText?: string | null
  maxChars?: number
  maxCharsErrorCode?: GraphQlExceptionCode
  additionalContent?: ReactElement
  preview?: {
    label: string
    render: (text: string) => ReactNode
  }
}

const PREVIEW_DIALOG_CONTENT_HEIGHT = 600

const TextAreaDialog = ({
  isOpen,
  onSave,
  onClose,
  loading,
  placeholder,
  defaultText,
  maxChars,
  maxCharsErrorCode = GraphQlExceptionCode.InvalidNoteSize,
  title,
  description,
  additionalContent,
  preview,
}: NoteProps): ReactElement => {
  const { t } = useTranslation('misc')
  const [text, setText] = useState<string>(defaultText ?? '')
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const showPreview = preview !== undefined && activeTab === 'preview'
  const maxCharsExceeded = maxChars === undefined ? false : text.length > maxChars
  const { title: errorMessage } = graphQlErrorMap({
    code: maxCharsErrorCode,
    maxSize: maxChars,
  })

  return (
    <ConfirmDialog
      open={isOpen}
      title={title}
      maxWidth='md'
      onConfirm={() => onSave(text)}
      onClose={onClose}
      cancelButtonText={t('close')}
      confirmButtonText={t('save')}
      confirmButtonIcon={<Save />}
      actionDisabled={maxCharsExceeded}
      loading={loading}
      showCloseIcon
    >
      {preview !== undefined && (
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          sx={{ marginBottom: 2 }}
        >
          <Tab value='edit' label={t('edit')} />
          <Tab value='preview' label={preview.label} />
        </Tabs>
      )}
      <Box
        // A fixed height prevents the dialog from changing its size when switching tabs
        sx={{
          height: preview !== undefined ? PREVIEW_DIALOG_CONTENT_HEIGHT : undefined,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {showPreview ? (
          <Box sx={{ flex: 1, minHeight: 0 }}>{preview.render(text)}</Box>
        ) : (
          <Stack sx={{ gap: 1, flex: 1, minHeight: 0 }}>
            {description !== undefined && (
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                {description}
              </Typography>
            )}
            <TextField
              id='outlined-textarea'
              rows={12}
              fullWidth
              placeholder={placeholder}
              multiline
              value={text}
              onChange={e => setText(e.target.value)}
              // A plain textarea instead of MUI's TextareaAutosize, which would set its own inline height
              slotProps={{ input: { inputComponent: 'textarea' } }}
              sx={{
                flex: 1,
                minHeight: 0,
                '& .MuiInputBase-root': { flex: 1, minHeight: 0, alignItems: 'stretch' },
                '& textarea': { height: '100%', overflowY: 'auto', resize: 'none' },
              }}
            />
            {maxChars !== undefined ? (
              <CharacterCounter text={text} maxChars={maxChars} />
            ) : undefined}
            {maxCharsExceeded ? <AlertBox title={errorMessage} severity='error' /> : undefined}
            {additionalContent}
          </Stack>
        )}
      </Box>
    </ConfirmDialog>
  )
}

export default TextAreaDialog
