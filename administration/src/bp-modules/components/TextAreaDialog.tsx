import { Dialog, DialogFooter, TextArea, Tooltip } from '@blueprintjs/core'
import { Close, SaveAlt } from '@mui/icons-material'
import { Button } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import graphQlErrorMap from '../../errors/GraphQlErrorMap'
import { GraphQlExceptionCode } from '../../generated/graphql'
import CharacterCounter from './CharacterCounter'

const ButtonContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  gap: 8px;
`

type NoteProps = {
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
  additionalContent,
}: NoteProps): ReactElement => {
  const { t } = useTranslation('misc')
  const [text, setText] = useState<string>(defaultText ?? '')
  const maxCharsExceeded = maxChars === undefined ? false : text.length > maxChars
  const { title: errorMessage } = graphQlErrorMap({
    code: GraphQlExceptionCode.InvalidNoteSize,
    maxSize: maxChars,
  })

  const actions = (
    <ButtonContainer>
      <Button startIcon={<Close />} size='small' onClick={onClose}>
        {t('close')}
      </Button>
      <Tooltip disabled={!maxCharsExceeded} content={errorMessage}>
        <Button
          disabled={maxCharsExceeded}
          loading={loading}
          variant='contained'
          size='small'
          startIcon={<SaveAlt />}
          onClick={() => onSave(text)}>
          {t('save')}
        </Button>
      </Tooltip>
    </ButtonContainer>
  )

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <TextArea
        fill
        onChange={e => setText(e.target.value)}
        value={text}
        readOnly={loading}
        rows={20}
        placeholder={placeholder}
      />
      {additionalContent}
      <DialogFooter actions={actions}>
        {maxChars !== undefined && <CharacterCounter text={text} maxChars={maxChars} />}
      </DialogFooter>
    </Dialog>
  )
}

export default TextAreaDialog
