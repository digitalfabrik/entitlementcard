import { TextField } from '@mui/material'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import FormAlert from '../../../../components/FormAlert'
import { EmailInput } from '../../../../graphql'
import i18next from '../../../../translations/i18n'
import { isEmailValid } from '../../../../util/verifications'
import { Form, FormComponentProps } from '../../util/formType'
import { FormContext } from '../forms/SteppedSubForms'
import { MAX_SHORT_TEXT_LENGTH } from './ShortTextForm'

const normalizeEmail = (email: string): string => email.trim().toLowerCase()

const preventClipboard = (event: React.SyntheticEvent): void => event.preventDefault()

const validateEmail = (email: string): string | null => {
  if (email === '') {
    return i18next.t('applicationForms:fieldRequiredError')
  }
  if (email.length > MAX_SHORT_TEXT_LENGTH) {
    return i18next.t('applicationForms:maxShortTextLengthError', {
      maxLength: MAX_SHORT_TEXT_LENGTH,
    })
  }
  if (!isEmailValid(email)) {
    return i18next.t('applicationForms:invalidMailError')
  }
  return null
}

const validateEmailConfirmation = (email: string, confirmation: string): string | null => {
  if (confirmation === '') {
    return i18next.t('applicationForms:fieldRequiredError')
  }
  if (normalizeEmail(email) !== normalizeEmail(confirmation)) {
    return i18next.t('applicationForms:emailMismatchError')
  }
  return null
}

// The email confirmation has to match the email and is used for validation only, it is not part of the validated input.
type State = { email: string; confirmation: string }
type ValidatedInput = EmailInput
type AdditionalProps = { label: string; minWidth?: number }
const EmailForm: Form<State, ValidatedInput, AdditionalProps> = {
  initialState: { email: '', confirmation: '' },
  getArrayBufferKeys: () => [],
  validate: ({ email, confirmation }) => {
    const errorMessage = validateEmail(email) ?? validateEmailConfirmation(email, confirmation)
    if (errorMessage !== null) {
      return { type: 'error', message: errorMessage }
    }
    return { type: 'valid', value: { email } }
  },
  Component: ({
    state,
    setState,
    label,
    minWidth = 100,
  }: FormComponentProps<State, AdditionalProps>) => {
    const { t } = useTranslation('applicationForms')
    const [emailInteracted, setEmailInteracted] = useState(false)
    const [emailConfirmationInteracted, setEmailConfirmationInteracted] = useState(false)
    const { showAllErrors, disableAllInputs } = useContext(FormContext)

    const emailError = validateEmail(state.email)
    const emailConfirmationError = validateEmailConfirmation(state.email, state.confirmation)
    const showEmailError = (showAllErrors || emailInteracted) && emailError !== null
    const showEmailConfirmationError =
      (showAllErrors || emailConfirmationInteracted) && emailConfirmationError !== null

    return (
      <>
        <TextField
          variant='standard'
          type='email'
          fullWidth
          style={{ margin: '4px 0', minWidth }}
          label={label}
          required
          error={showEmailError}
          value={state.email}
          disabled={disableAllInputs}
          onBlur={() => setEmailInteracted(true)}
          onChange={e => setState(prev => ({ ...prev, email: e.target.value }))}
          helperText={showEmailError && <FormAlert errorMessage={emailError} />}
          slotProps={{
            htmlInput: { maxLength: MAX_SHORT_TEXT_LENGTH },
          }}
        />
        <TextField
          variant='standard'
          type='email'
          fullWidth
          style={{ margin: '4px 0', minWidth }}
          label={t('emailAddressConfirmation')}
          required
          error={showEmailConfirmationError}
          value={state.confirmation}
          disabled={disableAllInputs}
          autoComplete='off'
          onBlur={() => setEmailConfirmationInteracted(true)}
          onChange={e => setState(prev => ({ ...prev, confirmation: e.target.value }))}
          onPaste={preventClipboard}
          onDrop={preventClipboard}
          helperText={
            showEmailConfirmationError && <FormAlert errorMessage={emailConfirmationError} />
          }
          slotProps={{
            htmlInput: { maxLength: MAX_SHORT_TEXT_LENGTH },
          }}
        />
      </>
    )
  },
}

export default EmailForm
