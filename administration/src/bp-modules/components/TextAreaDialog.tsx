import { Button, Dialog, DialogFooter, TextArea, Tooltip } from '@blueprintjs/core'
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
`

type NoteProps = {
  placeholder: string
  isOpen: boolean
  onSave: (text: string) => void
  onClose: () => void
  loading: boolean
  defaultText?: string | null
  maxChars?: number
}

const TextAreaDialog = ({
  isOpen,
  onSave,
  onClose,
  loading,
  placeholder,
  defaultText,
  maxChars,
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
      <Button intent='none' text={t('close')} icon='cross' onClick={onClose} />
      <Tooltip disabled={!maxCharsExceeded} content={errorMessage}>
        <Button
          disabled={maxCharsExceeded}
          loading={loading}
          intent='success'
          text={t('save')}
          icon='floppy-disk'
          onClick={() => onSave(text)}
        />
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
        large
        rows={20}
        placeholder={placeholder}
      />
      <DialogFooter actions={actions}>
        {maxChars !== undefined && <CharacterCounter text={text} maxChars={maxChars} />}
      </DialogFooter>
    </Dialog>
  )
}

export default TextAreaDialog
