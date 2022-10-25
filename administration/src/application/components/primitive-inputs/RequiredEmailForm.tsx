import { TextField } from '@mui/material'
import { useState } from 'react'
import { SetState } from '../forms/useUpdateStateCallback'

export type RequiredEmailFormState = string

export const initialRequiredEmailFormState: RequiredEmailFormState = ''

export const RequiredEmailForm = ({
  state,
  setState,
  label,
  minWidth = 100,
}: {
  state: RequiredEmailFormState
  setState: SetState<RequiredEmailFormState>
  label: string
  minWidth?: number
}) => {
  const [touched, setTouched] = useState(false)
  const isInvalid = state.length <= 0

  return (
    <TextField
      variant='standard'
      type='email'
      fullWidth
      style={{ margin: '4px 0', minWidth }}
      label={label}
      required
      error={touched && isInvalid}
      value={state}
      onBlur={() => setTouched(true)}
      onChange={e => setState(() => e.target.value)}
      helperText={touched && isInvalid ? `Feld ist erforderlich.` : ''}
    />
  )
}

export const convertRequiredEmailFormStateToInput = (state: RequiredEmailFormState): string => {
  if (state.length === 0) {
    throw Error('Invalid argument.')
  }
  return state
}
