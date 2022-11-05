import { TextField } from '@mui/material'
import { useState } from 'react'
import { Form } from '../../FormType'

export type DateFormState = { type: 'DateForm'; value: string }
type ValidatedInput = string
type Options = void
type AdditionalProps = { label: string; minWidth?: number }
const dateForm: Form<DateFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: { type: 'DateForm', value: '' },
  getValidatedInput: ({ value }) => {
    if (value === '') return { type: 'error', message: 'Feld ist erforderlich.' }
    const date = Date.parse(value)
    if (isNaN(date)) {
      return { type: 'error', message: 'Eingabe ist kein gültiges Datum.' }
    }
    return { type: 'valid', value: new Date(date).toString() }
  },
  Component: ({ state, setState, label, minWidth = 100 }) => {
    const [touched, setTouched] = useState(false)
    const validationResult = dateForm.getValidatedInput(state)

    const isInvalid = validationResult.type === 'error'

    return (
      <TextField
        variant='standard'
        fullWidth
        style={{ margin: '4px 0', minWidth }}
        type='date'
        label={label}
        required
        error={touched && isInvalid}
        value={state.value}
        sx={{ '& input[value=""]:not(:focus)': { color: 'transparent' } }}
        onBlur={() => setTouched(true)}
        onChange={e => setState(() => ({ type: 'DateForm', value: e.target.value }))}
        helperText={touched && isInvalid ? validationResult.message : ''}
      />
    )
  },
}

export default dateForm
