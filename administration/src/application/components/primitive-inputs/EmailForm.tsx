import { TextField } from '@mui/material'
import { useContext, useState } from 'react'
import { Form } from '../../FormType'
import { EmailInput } from '../../../generated/graphql'
import { FormContext } from '../SteppedSubForms'

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
    const { showAllErrors, disableAllInputs } = useContext(FormContext)
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
        disabled={disableAllInputs}
        onBlur={() => setTouched(true)}
        onChange={e => setState(() => ({ email: e.target.value }))}
        helperText={(showAllErrors || touched) && isInvalid ? validationResult.message : ''}
      />
    )
  },
}

export default EmailForm
