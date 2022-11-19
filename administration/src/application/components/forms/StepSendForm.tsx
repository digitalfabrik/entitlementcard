import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import CheckboxForm, { CheckboxFormState } from '../primitive-inputs/CheckboxForm'

const acceptedDatePrivacyOptions: { required: boolean; notCheckedErrorMessage: string } = {
  required: true,
  notCheckedErrorMessage: 'Um den Antrag zu senden, müssen Sie der Datenschutzverarbeitung zustimmen.',
}
const givenInformationIsCorrectAndCompleteOptions: { required: boolean; notCheckedErrorMessage: string } = {
  required: true,
  notCheckedErrorMessage: 'Diese Erklärung ist erforderlich.',
}

export type StepSendFormState = {
  acceptedDataPrivacy: CheckboxFormState
  givenInformationIsCorrectAndComplete: CheckboxFormState
}
type ValidatedInput = {
  hasAcceptedDataPrivacy: boolean
  givenInformationIsCorrectAndComplete: boolean
}
type Options = {}
type AdditionalProps = {}
const StepSendForm: Form<StepSendFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: {
    acceptedDataPrivacy: CheckboxForm.initialState,
    givenInformationIsCorrectAndComplete: CheckboxForm.initialState,
  },
  getArrayBufferKeys: state => [
    ...CheckboxForm.getArrayBufferKeys(state.acceptedDataPrivacy),
    ...CheckboxForm.getArrayBufferKeys(state.givenInformationIsCorrectAndComplete),
  ],
  getValidatedInput: state => {
    const hasAcceptedDataPrivacy = CheckboxForm.getValidatedInput(state.acceptedDataPrivacy, acceptedDatePrivacyOptions)
    const givenInformationIsCorrectAndComplete = CheckboxForm.getValidatedInput(
      state.givenInformationIsCorrectAndComplete,
      givenInformationIsCorrectAndCompleteOptions
    )
    if (hasAcceptedDataPrivacy.type === 'error' || givenInformationIsCorrectAndComplete.type === 'error')
      return { type: 'error' }
    return {
      type: 'valid',
      value: {
        hasAcceptedDataPrivacy: hasAcceptedDataPrivacy.value,
        givenInformationIsCorrectAndComplete: givenInformationIsCorrectAndComplete.value,
      },
    }
  },
  Component: ({ state, setState }) => (
    <>
      <CheckboxForm.Component
        label='Ich erkläre mich damit einverstanden, dass meine Daten zum Zwecke der Antragsverarbeitung
              gespeichert werden.'
        state={state.acceptedDataPrivacy}
        setState={useUpdateStateCallback(setState, 'acceptedDataPrivacy')}
        options={acceptedDatePrivacyOptions}
      />
      <CheckboxForm.Component
        label='Ich versichere, dass alle angegebenen Informationen korrekt und vollständig sind.'
        state={state.givenInformationIsCorrectAndComplete}
        setState={useUpdateStateCallback(setState, 'givenInformationIsCorrectAndComplete')}
        options={givenInformationIsCorrectAndCompleteOptions}
      />
    </>
  ),
}

export default StepSendForm
