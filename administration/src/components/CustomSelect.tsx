import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, { ReactElement, useState } from 'react'

import FormAlert from './FormAlert'

type SelectOption = {
  id: number | string
  name: number | string
}
type CustomSelectProps = {
  id: string
  label: string
  fullWidth?: boolean
  // shows error message even there was no interaction with the component yet
  forceError?: boolean
  value?: string | number
  onChange: (value: string | number) => void
  showError: boolean
  errorMessage: string | ReactElement | null
  required?: boolean
  options: SelectOption[]
  onBlur?: () => void
}

const CustomSelect = ({
  id,
  label,
  value,
  onChange,
  showError,
  errorMessage,
  forceError = false,
  fullWidth = false,
  required = false,
  options,
  onBlur,
}: CustomSelectProps): ReactElement => {
  const [interacted, setInteracted] = useState(false)
  const showErrorAfterInteraction = (interacted || forceError) && showError
  return (
    <Box>
      <FormControl fullWidth={fullWidth} size='small' required={required}>
        <InputLabel id={id} shrink={value !== undefined}>
          {label}
        </InputLabel>
        <Select
          required={required}
          notched={value !== undefined}
          size='small'
          fullWidth={fullWidth}
          error={showErrorAfterInteraction}
          labelId={id}
          label={label}
          value={value ?? ''}
          onBlur={() => {
            setInteracted(true)
            if (onBlur) {
              onBlur()
            }
          }}
          onChange={event => onChange(event.target.value)}
        >
          {options.map(option => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {showErrorAfterInteraction && <FormAlert errorMessage={errorMessage} />}
    </Box>
  )
}

export default CustomSelect
