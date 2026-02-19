import { InputProps, SxProps, TextField } from '@mui/material'
import React, { ReactElement, useState } from 'react'

import FormAlert from '../../../components/FormAlert'

type CardTextFieldProps = {
  id: string
  label: string | ReactElement
  placeholder: string
  autoFocus?: boolean
  // shows error message even there was no interaction with the component yet
  forceError?: boolean
  value: string
  onChange: (value: string) => void
  showError: boolean
  errorMessage: string | ReactElement | null
  inputProps?: Partial<InputProps>
  required?: boolean
  sx?: SxProps
  onBlur?: () => void
  rows?: number
  multiline?: boolean
}

const CardTextField = ({
  id,
  label,
  placeholder,
  autoFocus = false,
  value,
  onChange,
  showError,
  errorMessage,
  inputProps,
  forceError = false,
  required = false,
  sx,
  onBlur,
  rows = 1,
  multiline = false,
}: CardTextFieldProps): ReactElement => {
  const [interacted, setInteracted] = useState(false)
  const showErrorAfterInteraction = (interacted || forceError) && showError
  return (
    <TextField
      id={id}
      sx={sx}
      label={label}
      placeholder={placeholder}
      autoFocus={autoFocus}
      rows={rows}
      multiline={multiline}
      value={value}
      onBlur={() => {
        setInteracted(true)
        onBlur?.()
      }}
      onChange={event => onChange(event.target.value)}
      error={showErrorAfterInteraction}
      fullWidth
      required={required}
      size='small'
      helperText={showErrorAfterInteraction && <FormAlert errorMessage={errorMessage} />}
      slotProps={{
        input: inputProps,
        formHelperText: { sx: { margin: 0 } },
      }}
    />
  )
}

export default CardTextField
