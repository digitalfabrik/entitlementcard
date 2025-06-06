import { Checkbox, FormControl, FormControlLabel, FormGroup, styled } from '@mui/material'
import React, { ReactElement } from 'react'

import FormAlert from './FormAlert'

const StyledFormControlLabel = styled(FormControlLabel)`
  margin: 8px 0;
`

type BaseCheckboxProps = {
  disabled?: boolean
  required?: boolean
  checked: boolean
  label: string | ReactElement
  onChange: (checked: boolean) => void
  onBlur?: () => void
  hasError: boolean
  errorMessage: string | null | undefined
}

const BaseCheckbox = ({
  label,
  disabled = false,
  checked,
  required = false,
  onBlur,
  onChange,
  hasError,
  errorMessage,
}: BaseCheckboxProps): ReactElement => (
  <FormGroup>
    <FormControl required={required} error={hasError} disabled={disabled}>
      <StyledFormControlLabel
        control={
          <Checkbox
            sx={{ pl: 0 }}
            required={required}
            checked={checked}
            onBlur={onBlur}
            onChange={e => {
              onChange(e.target.checked)
            }}
          />
        }
        label={label}
      />
      {hasError && <FormAlert errorMessage={errorMessage} />}
    </FormControl>
  </FormGroup>
)

export default BaseCheckbox
