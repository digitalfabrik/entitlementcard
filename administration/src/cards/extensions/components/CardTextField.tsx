import { InputProps, TextField } from '@mui/material'
import React, { ReactElement, useState } from 'react'

import FormAlert from '../../../mui-modules/base/FormAlert'

type CardTextFieldProps = {
  id: string
  label: string
  placeholder: string
  autoFocus?: boolean
  value: string
  onChange: (value: string) => void
  showError: boolean
  errorMessage: string | null
  inputProps?: Partial<InputProps>
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
}: CardTextFieldProps): ReactElement => {
  const [touched, setTouched] = useState(false)
  const showErrorAfterTouched = touched && showError
  return (
    <TextField
      id={id}
      label={label}
      placeholder={placeholder}
      autoFocus={autoFocus}
      value={value}
      onBlur={() => setTouched(true)}
      onChange={event => onChange(event.target.value)}
      error={showErrorAfterTouched}
      fullWidth
      size='small'
      helperText={showErrorAfterTouched && <FormAlert errorMessage={errorMessage} />}
      slotProps={{
        input: inputProps,
        formHelperText: { sx: { margin: 0 } },
      }}
    />
  )
}

export default CardTextField
