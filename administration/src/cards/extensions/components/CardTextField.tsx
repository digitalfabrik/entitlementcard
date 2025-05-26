import { FormGroup, InputProps, TextField } from '@mui/material'
import React, { ReactElement } from 'react'

import FormAlert from '../../../bp-modules/self-service/components/FormAlert'

type CardTextFieldProps = {
  id: string
  label: string
  placeholder: string
  autoFocus?: boolean
  value: string
  onBlur?: () => void
  onChange: (value: string) => void
  showError: boolean
  errorMessage: string | null
  inputProps: Partial<InputProps>
}

const CardTextField = ({
  id,
  label,
  placeholder,
  autoFocus = false,
  value,
  onBlur,
  onChange,
  showError,
  errorMessage,
  inputProps,
}: CardTextFieldProps): ReactElement => (
  <FormGroup>
    <TextField
      id={id}
      label={label}
      placeholder={placeholder}
      autoFocus={autoFocus}
      value={value}
      onBlur={onBlur}
      onChange={event => onChange(event.target.value)}
      error={showError}
      fullWidth
      size='small'
      InputProps={inputProps}
    />
    {showError && <FormAlert errorMessage={errorMessage} />}
  </FormGroup>
)

export default CardTextField
