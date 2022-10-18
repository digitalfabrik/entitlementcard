import { TextField } from '@mui/material'
import { useState } from 'react'

export type RequiredEmailFormState = string

export const initialRequiredStringFormState: RequiredEmailFormState = ''

export const RequiredEmailForm = ({
  state,
  setState,
  label,
  minWidth = 100,
}: {
  state: RequiredEmailFormState
  setState: (value: RequiredEmailFormState) => void
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
      onChange={e => setState(e.target.value)}
      helperText={touched && isInvalid ? `Feld ist erforderlich.` : ''}
    />
  )
}

export const convertRequiredStringFormStateToInput = (state: RequiredEmailFormState): string => {
  if (state.length === 0) {
    throw Error('Invalid argument.')
  }
  return state
}
