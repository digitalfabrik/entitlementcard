import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { BlueCardApplicationInput } from '../../../generated/graphql'
import { Form } from '../../FormType'
import PersonalDataForm, { PersonalDataFormState } from './PersonalDataForm'
import SteppedSubForms, { useFormAsStep } from '../SteppedSubForms'
import StepCardTypeForm, { StepCardTypeFormState } from './StepCardTypeForm'
import StepRequirementsForm, { StepRequirementsFormState } from './StepRequirementsForm'
import StepSendForm, { StepSendFormState } from './StepSendForm'

type RegionId = number

export type ApplicationFormState = {
  activeStep: number
  stepPersonalData: PersonalDataFormState
  stepCardType: StepCardTypeFormState
  stepRequirements: StepRequirementsFormState
  stepSend: StepSendFormState
}
type ValidatedInput = [RegionId, BlueCardApplicationInput]
type Options = {}
type AdditionalProps = { onSubmit: () => void; loading: boolean; privacyPolicy: string }
const ApplicationForm: Form<ApplicationFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: {
    activeStep: 0,
    stepPersonalData: PersonalDataForm.initialState,
    stepCardType: StepCardTypeForm.initialState,
    stepRequirements: StepRequirementsForm.initialState,
    stepSend: StepSendForm.initialState,
  },
  getArrayBufferKeys: state => [
    ...PersonalDataForm.getArrayBufferKeys(state.stepPersonalData),
    ...StepCardTypeForm.getArrayBufferKeys(state.stepCardType),
    ...StepRequirementsForm.getArrayBufferKeys(state.stepRequirements),
    ...StepSendForm.getArrayBufferKeys(state.stepSend),
  ],
  getValidatedInput: state => {
    const personalData = PersonalDataForm.getValidatedInput(state.stepPersonalData)
    const stepCardType = StepCardTypeForm.getValidatedInput(state.stepCardType)
    if (personalData.type === 'error' || stepCardType.type === 'error') return { type: 'error' }

    const stepRequirements = StepRequirementsForm.getValidatedInput(state.stepRequirements)
    const stepSend = StepSendForm.getValidatedInput(state.stepSend)
    if (stepRequirements.type === 'error' || stepSend.type === 'error') return { type: 'error' }

    return {
      type: 'valid',
      value: [
        1, // TODO: Add a mechanism to retrieve this regionId,
        {
          personalData: personalData.value,
          applicationType: stepCardType.value.applicationType,
          entitlement: stepRequirements.value,
          hasAcceptedPrivacyPolicy: stepSend.value.hasAcceptedDataPrivacy,
          givenInformationIsCorrectAndComplete: stepSend.value.givenInformationIsCorrectAndComplete,
        },
      ],
    }
  },
  Component: ({ state, setState, onSubmit, loading, privacyPolicy }) => {
    const personalDataStep = useFormAsStep(
      'Persönliche Angaben',
      PersonalDataForm,
      state,
      setState,
      'stepPersonalData',
      {},
      {}
    )
    const cardTypeStep = useFormAsStep('Kartentyp', StepCardTypeForm, state, setState, 'stepCardType', {}, {})
    const requirementsStep = useFormAsStep(
      'Voraussetzungen',
      StepRequirementsForm,
      state,
      setState,
      'stepRequirements',
      { cardType: state.stepCardType.cardType },
      {}
    )
    const sendStep = useFormAsStep('Antrag Senden', StepSendForm, state, setState, 'stepSend', {}, { privacyPolicy })
    return (
      <SteppedSubForms
        activeStep={state.activeStep}
        setActiveStep={useUpdateStateCallback(setState, 'activeStep')}
        subForms={[personalDataStep, cardTypeStep, requirementsStep, sendStep]}
        onSubmit={onSubmit}
        loading={loading}
      />
    )
  },
}

export default ApplicationForm
