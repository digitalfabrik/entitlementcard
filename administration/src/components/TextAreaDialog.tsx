import { Save } from '@mui/icons-material'
import { Box, Stack, Tab, Tabs, TextField, Typography } from '@mui/material'
import { ReactElement, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'

import AlertBox from '../components/AlertBox'
import CharacterCounter from './CharacterCounter'
import ConfirmDialog from './ConfirmDialog'

const TextAreaDialog = ({
  isOpen,
  onSave,
  onClose,
  loading,
  placeholder,
  defaultText,
  maxChars,
  maxCharsErrorMessage,
  title,
  description,
  additionalContent,
  preview,
}: {
  title: string
  description?: string
  placeholder: string
  isOpen: boolean
  onSave: (text: string) => void
  onClose: () => void
  loading: boolean
  defaultText?: string | null
  maxChars: number
  maxCharsErrorMessage: string
  additionalContent?: ReactElement
  preview?: {
    label: string
    render: (text: string) => ReactNode
  }
}): ReactElement => {
  const { t } = useTranslation('misc')
  const [text, setText] = useState<string>(defaultText ?? '')
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const showPreview = preview !== undefined && activeTab === 'preview'
  const maxCharsExceeded = text.length > maxChars

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
      // A fixed height prevents the dialog from changing its size when switching tabs
      fillHeight={preview !== undefined}
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
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
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
                minHeight: 120,
                '& .MuiInputBase-root': { flex: 1, minHeight: 0, alignItems: 'stretch' },
                '& textarea': { height: '100%', overflowY: 'auto', resize: 'none' },
              }}
            />
            <CharacterCounter text={text} maxChars={maxChars} />
            {maxCharsExceeded ? (
              <AlertBox title={maxCharsErrorMessage} severity='error' />
            ) : undefined}
            {additionalContent}
          </Stack>
        )}
      </Box>
    </ConfirmDialog>
  )
}

export default TextAreaDialog
