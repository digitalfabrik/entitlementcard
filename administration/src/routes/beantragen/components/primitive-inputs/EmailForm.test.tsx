import { fireEvent } from '@testing-library/react'
import { ReactElement, useState } from 'react'

import { CustomRenderOptions, renderWithOptions } from '../../../../testing/render'
import { FormContext } from '../forms/SteppedSubForms'
import EmailForm from './EmailForm'

const mockProvider: CustomRenderOptions = { translation: true }

const fieldRequiredError = 'Feld ist erforderlich.'
const invalidMailError = 'E-Mail-Adresse ist ungültig.'
const emailMismatchError = 'Die E-Mail-Adressen stimmen nicht überein.'

const StatefulEmailForm = ({
  initialState = EmailForm.initialState,
}: {
  initialState?: typeof EmailForm.initialState
}): ReactElement => {
  const [state, setState] = useState(initialState)
  return <EmailForm.Component state={state} setState={setState} label='E-Mail-Adresse' />
}

const renderEmailForm = (initialState?: typeof EmailForm.initialState) => {
  const result = renderWithOptions(<StatefulEmailForm initialState={initialState} />, mockProvider)
  return {
    ...result,
    emailInput: result.getByLabelText(/^E-Mail-Adresse\s*\*?$/),
    confirmationInput: result.getByLabelText(/^E-Mail-Adresse wiederholen/),
  }
}

describe('EmailForm', () => {
  describe('validate', () => {
    it('should return the email if email and confirmation match', () => {
      expect(
        EmailForm.validate({ email: 'erika@example.com', confirmation: 'erika@example.com' }),
      ).toEqual({ type: 'valid', value: { email: 'erika@example.com' } })
    })

    it('should ignore case and surrounding whitespace when comparing the confirmation', () => {
      expect(
        EmailForm.validate({ email: 'Erika@Example.com', confirmation: ' erika@example.com ' }),
      ).toEqual({ type: 'valid', value: { email: 'Erika@Example.com' } })
    })

    it('should return an error if the email is empty', () => {
      expect(EmailForm.validate({ email: '', confirmation: '' })).toEqual({
        type: 'error',
        message: fieldRequiredError,
      })
    })

    it('should return an error if the email is invalid', () => {
      expect(EmailForm.validate({ email: 'erika', confirmation: 'erika' })).toEqual({
        type: 'error',
        message: invalidMailError,
      })
    })

    it('should return an error if the confirmation is empty', () => {
      expect(EmailForm.validate({ email: 'erika@example.com', confirmation: '' })).toEqual({
        type: 'error',
        message: fieldRequiredError,
      })
    })

    it('should return an error if the confirmation does not match', () => {
      expect(
        EmailForm.validate({ email: 'erika@example.com', confirmation: 'erik@example.com' }),
      ).toEqual({ type: 'error', message: emailMismatchError })
    })
  })

  describe('Component', () => {
    it('should render the email and the confirmation field', () => {
      const { emailInput, confirmationInput } = renderEmailForm()
      expect(emailInput).toBeTruthy()
      expect(confirmationInput).toBeTruthy()
    })

    it('should show a mismatch error on the confirmation field after it was left', () => {
      const { confirmationInput, emailInput, queryByText } = renderEmailForm()
      fireEvent.change(emailInput, { target: { value: 'erika@example.com' } })
      fireEvent.change(confirmationInput, { target: { value: 'erik@example.com' } })
      expect(queryByText(emailMismatchError)).toBeNull()

      fireEvent.blur(confirmationInput)
      expect(queryByText(emailMismatchError)).toBeTruthy()
      expect(confirmationInput.getAttribute('aria-invalid')).toBe('true')
      expect(emailInput.getAttribute('aria-invalid')).toBe('false')
    })

    it('should remove the mismatch error once the email is corrected', () => {
      const { confirmationInput, emailInput, queryByText } = renderEmailForm({
        email: 'erik@example.com',
        confirmation: 'erika@example.com',
      })
      fireEvent.blur(confirmationInput)
      expect(queryByText(emailMismatchError)).toBeTruthy()

      fireEvent.change(emailInput, { target: { value: 'erika@example.com' } })
      expect(queryByText(emailMismatchError)).toBeNull()
    })

    it('should prevent pasting and dropping into the confirmation field', () => {
      const { confirmationInput } = renderEmailForm()
      // fireEvent returns false if the event was cancelled via preventDefault
      expect(fireEvent.paste(confirmationInput)).toBe(false)
      expect(fireEvent.drop(confirmationInput)).toBe(false)
    })

    it('should allow pasting into the email field', () => {
      const { emailInput } = renderEmailForm()
      expect(fireEvent.paste(emailInput)).toBe(true)
    })

    it('should show all errors when the form is submitted', () => {
      const { getAllByText } = renderWithOptions(
        <FormContext.Provider value={{ showAllErrors: true, disableAllInputs: false }}>
          <StatefulEmailForm />
        </FormContext.Provider>,
        mockProvider,
      )
      expect(getAllByText(fieldRequiredError)).toHaveLength(2)
    })
  })
})
