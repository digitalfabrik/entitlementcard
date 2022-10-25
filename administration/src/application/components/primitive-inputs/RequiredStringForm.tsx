import { TextField } from '@mui/material'
import { useState } from 'react'
import { SetState } from '../forms/useUpdateStateCallback'

export type RequiredStringFormState = string

export const initialRequiredStringFormState: RequiredStringFormState = ''

export const RequiredStringForm = ({
  state,
  setState,
  label,
  minWidth = 200,
}: {
  state: RequiredStringFormState
  setState: SetState<RequiredStringFormState>
  label: string
  minWidth?: number
}) => {
  const [touched, setTouched] = useState(false)
  const isInvalid = state.length <= 0

  return (
    <TextField
      variant='standard'
      fullWidth
      style={{ margin: '4px 0', minWidth }}
      label={label}
      required
      error={touched && isInvalid}
      onBlur={() => setTouched(true)}
      value={state}
      onChange={e => setState(() => e.target.value)}
      helperText={touched && isInvalid ? `Feld ist erforderlich.` : ''}
    />
  )
}

export const convertRequiredStringFormStateToInput = (state: RequiredStringFormState): string => {
  if (state.length === 0) {
    throw Error('Invalid argument.')
  }
  return state
}
