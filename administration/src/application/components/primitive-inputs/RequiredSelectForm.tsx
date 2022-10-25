import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import { useState } from 'react'
import { SetState } from '../forms/useUpdateStateCallback'

export type RequiredSelectFormState = string

export const initialRequiredSelectFormState: RequiredSelectFormState = ''

export const RequiredSelectForm = ({
  state,
  setState,
  label,
  options,
}: {
  state: RequiredSelectFormState
  setState: SetState<RequiredSelectFormState>
  label: string
  options: string[]
}) => {
  const [touched, setTouched] = useState(false)

  let error: string | null = null
  if (state === '') {
    error = `Feld ist erforderlich.`
  }

  const isInvalid = error !== null

  return (
    <FormControl fullWidth variant='standard' required style={{ margin: '4px 0' }} error={touched && isInvalid}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={state}
        label={label}
        onBlur={() => setTouched(true)}
        onChange={e => setState(() => e.target.value)}>
        {options.map(category => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </Select>
      {!touched || !isInvalid ? null : <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}

export const convertRequiredSelectFormStateToInput = (state: RequiredSelectFormState): string => {
  if (state === '') throw Error('Invalid option!')
  return state
}
