import { ApplicationInput, BavariaCardType, Region } from '../../../generated/graphql'
import { Form } from '../../FormType'
import PersonalDataForm from './PersonalDataForm'
import StepCardTypeForm from './StepCardTypeForm'
import StepRequirementsForm from './StepRequirementsForm'
import StepSendForm from './StepSendForm'
import SteppedSubForms, { useFormAsStep } from '../SteppedSubForms'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { CompoundState, createCompoundGetArrayBufferKeys, createCompoundInitialState } from '../../compoundFormUtils'

type RegionId = number

const SubForms = {
  stepPersonalData: PersonalDataForm,
  stepCardType: StepCardTypeForm,
  stepRequirements: StepRequirementsForm,
  stepSend: StepSendForm,
}

type State = { activeStep: number } & CompoundState<typeof SubForms>
type ValidatedInput = [RegionId, ApplicationInput]
type Options = { regions: Region[] }
type AdditionalProps = { onSubmit: () => void; loading: boolean; privacyPolicy: string }
const ApplicationForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: {
    ...createCompoundInitialState(SubForms),
    activeStep: 0,
  },
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: state => {
    const personalData = PersonalDataForm.validate(state.stepPersonalData, { regions: [] })
    const stepCardType = StepCardTypeForm.validate(state.stepCardType)
    if (personalData.type === 'error' || stepCardType.type === 'error') return { type: 'error' }

    const stepRequirements = StepRequirementsForm.validate(state.stepRequirements, {
      cardType: stepCardType.value.cardType,
    })
    const stepSend = StepSendForm.validate(state.stepSend)
    if (stepRequirements.type === 'error' || stepSend.type === 'error') return { type: 'error' }

    return {
      type: 'valid',
      value: [
        Number(state.stepPersonalData.region.region.selectedValue), // TODO: Add check for regionId, uncomment options validation
        {
          personalData: personalData.value,
          cardType: stepCardType.value.cardType,
          applicationType: stepCardType.value.applicationType,
          wantsDigitalCard: stepCardType.value.wantsDigitalCard,
          blueCardEntitlement:
            stepRequirements.value.type === BavariaCardType.Blue ? stepRequirements.value.value : null,
          goldenCardEntitlement:
            stepRequirements.value.type === BavariaCardType.Golden ? stepRequirements.value.value : null,
          hasAcceptedPrivacyPolicy: stepSend.value.hasAcceptedDataPrivacy,
          givenInformationIsCorrectAndComplete: stepSend.value.givenInformationIsCorrectAndComplete,
        },
      ],
    }
  },
  Component: ({ state, setState, options, onSubmit, loading, privacyPolicy }) => {
    const personalDataStep = useFormAsStep(
      'Persönliche Angaben',
      PersonalDataForm,
      state,
      setState,
      'stepPersonalData',
      { regions: options.regions },
      {}
    )
    const cardTypeStep = useFormAsStep('Kartentyp', StepCardTypeForm, state, setState, 'stepCardType', {}, {})
    const requirementsStep = useFormAsStep(
      'Voraussetzungen',
      StepRequirementsForm,
      state,
      setState,
      'stepRequirements',
      { cardType: state.stepCardType.cardType.selectedValue },
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
