import { FormGroup, FormHelperText, InputProps, TextField } from '@mui/material'
import React, { ReactElement } from 'react'

import FormAlert from '../../../bp-modules/self-service/components/FormAlert'

type CardTextFieldProps = {
  id: string
  label: string
  placeholder: string
  autoFocus?: boolean
  value: string
  onChange: (value: string) => void
  hasError: boolean
  errorMessage: string | null
  touched: boolean
  setTouched: (value: boolean) => void
  inputProps: Partial<InputProps>
}

const CardTextField = ({
  id,
  label,
  placeholder,
  autoFocus = false,
  value,
  onChange,
  hasError,
  errorMessage,
  touched,
  setTouched,
  inputProps,
}: CardTextFieldProps): ReactElement => {
  const showErrorMessage = hasError && touched
  return (
    <FormGroup>
      <TextField
        id={id}
        label={label}
        placeholder={placeholder}
        autoFocus={autoFocus}
        value={value}
        onBlur={() => setTouched(true)}
        onChange={event => onChange(event.target.value)}
        error={hasError}
        fullWidth
        size='small'
        sx={{ '& .MuiFormHelperText-root': { margin: '0px' } }}
        InputProps={inputProps}
      />
      {showErrorMessage && (
        <FormHelperText id='name-input' component='div'>
          <FormAlert errorMessage={errorMessage} />
        </FormHelperText>
      )}
    </FormGroup>
  )
}

export default CardTextField
