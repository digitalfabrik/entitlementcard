import { TextField } from '@mui/material'
import { useState } from 'react'
import { Form } from '../../FormType'
import { EmailInput } from '../../../generated/graphql'

export type EmailFormState = { email: string }
type ValidatedInput = EmailInput
type Options = {}
type AdditionalProps = { label: string; minWidth?: number }
const EmailForm: Form<EmailFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: { email: '' },
  getArrayBufferKeys: () => [],
  getValidatedInput: ({ email }) => {
    if (email === '') return { type: 'error', message: 'Feld ist erforderlich.' }
    return { type: 'valid', value: { email } }
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
        value={state.email}
        onBlur={() => setTouched(true)}
        onChange={e => setState(() => ({ email: e.target.value }))}
        helperText={touched && isInvalid ? validationResult.message : ''}
      />
    )
  },
}

export default EmailForm
