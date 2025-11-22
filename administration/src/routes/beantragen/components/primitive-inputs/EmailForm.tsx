import { TextField } from '@mui/material'
import React, { useContext, useState } from 'react'

import { EmailInput } from '../../../../generated/graphql'
import FormAlert from '../../../../shared/components/FormAlert'
import { isEmailValid } from '../../../../shared/verifications'
import i18next from '../../../../translations/i18n'
import { Form, FormComponentProps } from '../../util/FormType'
import { FormContext } from '../forms/SteppedSubForms'
import { MAX_SHORT_TEXT_LENGTH } from './ShortTextForm'

type State = { email: string }
type ValidatedInput = EmailInput
type AdditionalProps = { label: string; minWidth?: number }
const EmailForm: Form<State, ValidatedInput, AdditionalProps> = {
  initialState: { email: '' },
  getArrayBufferKeys: () => [],
  validate: ({ email }) => {
    if (email === '') {
      return { type: 'error', message: i18next.t('applicationForms:fieldRequiredError') }
    }
    if (email.length > MAX_SHORT_TEXT_LENGTH) {
      return {
        type: 'error',
        message: i18next.t('applicationForms:maxShortTextLengthError', { maxLength: MAX_SHORT_TEXT_LENGTH }),
      }
    }
    if (!isEmailValid(email)) {
      return {
        type: 'error',
        message: i18next.t('applicationForms:invalidMailError'),
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
        onBlur={() => setTouched(true)}
        onChange={e => setState(() => ({ email: e.target.value }))}
        helperText={(showAllErrors || touched) && isInvalid && <FormAlert errorMessage={validationResult.message} />}
        slotProps={{
          htmlInput: { maxLength: MAX_SHORT_TEXT_LENGTH },
        }}
      />
    )
  },
}

export default EmailForm
