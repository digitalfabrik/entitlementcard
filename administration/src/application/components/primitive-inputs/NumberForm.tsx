import { TextField } from '@mui/material'
import { useState } from 'react'

export type NumberFormState = string

export const initialNumberFormState: NumberFormState = ''

export const NumberForm = ({
  state,
  setState,
  label,
  minWidth = 100,
  min,
  max,
}: {
  state: NumberFormState
  setState: (value: NumberFormState) => void
  label: string
  minWidth?: number
  min: number
  max: number
}) => {
  const [touched, setTouched] = useState(false)

  let error: string | null = null
  if (state.length <= 0) {
    error = `Feld ist erforderlich.`
  } else {
    const number = parseFloat(state)
    if (isNaN(number)) {
      error = `${label} muss eine Zahl sein.`
    } else if (number < min || number > max) {
      error = `${label} muss zwischen ${min} und ${max} sein.`
    }
  }
  const isInvalid = error !== null

  return (
    <TextField
      variant='standard'
      fullWidth
      style={{ margin: '4px 0', minWidth }}
      type='number'
      label={label}
      required
      error={touched && isInvalid}
      value={state}
      onBlur={() => setTouched(true)}
      onChange={e => setState(e.target.value)}
      helperText={touched && isInvalid ? error : ''}
      inputProps={{ inputMode: 'numeric', min, max }}
    />
  )
}

export const convertNumberFormStateToInput = (state: NumberFormState, min: number, max: number): number => {
  const number = parseFloat(state)
  if (isNaN(number)) {
    throw Error('Is not a number')
  } else if (number < min || number > max) {
    throw Error('')
  }
  return number
}
