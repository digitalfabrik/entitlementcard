import { TextField } from '@mui/material'
import { useState } from 'react'
import { Form } from '../../FormType'

const MAX_CHARACTERS = 300

export type ShortTextFormState = {
  type: 'ShortText'
  value: string
}
type ValidatedInput = string
type Options = void
type AdditionalProps = { label: string; minWidth?: number }
const shortTextForm: Form<ShortTextFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: { type: 'ShortText', value: '' },
  getValidatedInput: ({ value }) => {
    if (value.length === 0) return { type: 'error', message: 'Feld ist erforderlich.' }
    if (value.length > MAX_CHARACTERS)
      return {
        type: 'error',
        message: `Text überschreitet die erlaubten ${MAX_CHARACTERS} Zeichen.`,
      }
    return { type: 'valid', value }
  },
  Component: ({ state, setState, label, minWidth = 200 }) => {
    const [touched, setTouched] = useState(false)
    const validationResult = shortTextForm.getValidatedInput(state)
    const isInvalid = validationResult.type === 'error'

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
        onChange={e => setState(() => ({ type: 'ShortText', value: e.target.value }))}
        helperText={touched && isInvalid ? validationResult.message : ''}
      />
    )
  },
}

export default shortTextForm
