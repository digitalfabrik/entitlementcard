import { TextField } from '@mui/material'
import React, { useContext, useState } from 'react'

import { isEmailValid } from '../../../bp-modules/applications/utils/verificationHelper'
import { EmailInput } from '../../../generated/graphql'
import { FormContext } from '../SteppedSubForms'
import { Form, FormComponentProps } from '../util/FormType'
import { MAX_SHORT_TEXT_LENGTH } from './ShortTextForm'

type State = { email: string }
type ValidatedInput = EmailInput
type AdditionalProps = { label: string; minWidth?: number }
const EmailForm: Form<State, ValidatedInput, AdditionalProps> = {
  initialState: { email: '' },
  getArrayBufferKeys: () => [],
  validate: ({ email }) => {
    if (email === '') {
      return { type: 'error', message: 'Feld ist erforderlich.' }
    }
    if (email.length > MAX_SHORT_TEXT_LENGTH) {
      return {
        type: 'error',
        message: `Text überschreitet die maximal erlaubten ${MAX_SHORT_TEXT_LENGTH} Zeichen.`,
      }
    }
    if (!isEmailValid(email)) {
      return {
        type: 'error',
        message: `E-Mail-Adresse ist ungültig.`,
      }
    }
    return { type: 'valid', value: { email } }
  },
  Component: ({ state, setState, label, minWidth = 100 }: FormComponentProps<State, AdditionalProps>) => {
    const [touched, setTouched] = useState(false)
    const { showAllErrors, disableAllInputs } = useContext(FormContext)
    const validationResult = EmailForm.validate(state)

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
        inputProps={{ maxLength: MAX_SHORT_TEXT_LENGTH }}
        onBlur={() => setTouched(true)}
        onChange={e => setState(() => ({ email: e.target.value }))}
        helperText={(showAllErrors || touched) && isInvalid ? validationResult.message : ''}
      />
    )
  },
}

export default EmailForm
