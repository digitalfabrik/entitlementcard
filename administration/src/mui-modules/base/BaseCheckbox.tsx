import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText } from '@mui/material'
import React, { ReactElement } from 'react'

import FormAlert from './FormAlert'

type BaseCheckboxProps = {
  disabled?: boolean
  required?: boolean
  checked: boolean
  label: string | ReactElement
  onChange: (checked: boolean) => void
  hasError: boolean
  errorMessage: string | null | undefined
  touched: boolean
  setTouched: (touched: boolean) => void | undefined
}

const BaseCheckbox = ({
  label,
  disabled = false,
  checked,
  required = false,
  touched,
  setTouched,
  onChange,
  hasError,
  errorMessage,
}: BaseCheckboxProps): ReactElement => {
  const showErrorMessage = touched && hasError
  return (
    <FormGroup onBlur={() => setTouched(true)}>
      <FormControl required={required} error={hasError} disabled={disabled}>
        <FormControlLabel
          style={{ margin: '8px 0' }}
          control={
            <Checkbox
              sx={{ pl: 0 }}
              required={required}
              checked={checked}
              onChange={e => {
                setTouched(true)
                onChange(e.target.checked)
              }}
            />
          }
          label={label}
        />
        {showErrorMessage && (
          <FormHelperText component='div' sx={{ margin: 0 }}>
            <FormAlert errorMessage={errorMessage} />
          </FormHelperText>
        )}
      </FormControl>
    </FormGroup>
  )
}

export default BaseCheckbox
