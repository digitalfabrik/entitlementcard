import { TextField } from '@mui/material'
import { useState } from 'react'
import { Form } from '../../FormType'

export type EmailFormState = { type: 'EmailForm'; value: string }
type ValidatedInput = string
type Options = {}
type AdditionalProps = { label: string; minWidth?: number }
const EmailForm: Form<EmailFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: { type: 'EmailForm', value: '' },
  getArrayBufferKeys: () => [],
  getValidatedInput: ({ value }) => {
    if (value === '') return { type: 'error', message: 'Feld ist erforderlich.' }
    return { type: 'valid', value }
  },
  Component: ({ state, setState, label, minWidth = 100 }) => {
    const [touched, setTouched] = useState(false)
    const validationResult = EmailForm.getValidatedInput(state)

    const isInvalid = validationResult.type === 'error'

    return (
      <TextField
        variant='standard'
        type='email'
        fullWidth
        style={{ margin: '4px 0', minWidth }}
        label={label}
        required
        error={touched && isInvalid}
        value={state.value}
        onBlur={() => setTouched(true)}
        onChange={e => setState(() => ({ type: 'EmailForm', value: e.target.value }))}
        helperText={touched && isInvalid ? validationResult.message : ''}
      />
    )
  },
}

export default EmailForm
