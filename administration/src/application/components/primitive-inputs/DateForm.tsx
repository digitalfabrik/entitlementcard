import { TextField } from '@mui/material'
import { useState } from 'react'

export type DateFormState = string

export const initialDateFormState: DateFormState = ''

export const DateForm = ({
  state,
  setState,
  label,
  minWidth = 100,
}: {
  state: DateFormState
  setState: (value: DateFormState) => void
  label: string
  minWidth?: number
}) => {
  const [touched, setTouched] = useState(false)

  let error: string | null = null
  if (state === '') {
    error = `Feld ist erforderlich.`
  } else {
    const date = Date.parse(state)
    if (isNaN(date)) {
      error = `Kein gültiges Datum. DD-MM-YYYY`
    }
  }

  const isInvalid = error !== null

  return (
    <TextField
      variant='standard'
      fullWidth
      style={{ margin: '4px 0', minWidth }}
      type='date'
      label={label}
      required
      error={touched && isInvalid}
      value={state}
      sx={{ '& input[value=""]:not(:focus)': { color: 'transparent' } }}
      onBlur={() => setTouched(true)}
      onChange={e => setState(e.target.value)}
      helperText={touched && isInvalid ? error : ''}
    />
  )
}

export const convertDateFormStateToInput = (state: DateFormState): string => {
  if (state === '') {
    throw Error('Feld ist erforderlich.')
  } else {
    const date = Date.parse(state)
    if (isNaN(date)) {
      throw Error(`Kein gültiges Datum.`)
    }
    return new Date(date).toString()
  }
}
