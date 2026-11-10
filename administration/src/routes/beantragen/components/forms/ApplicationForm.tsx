import { useTranslation } from 'react-i18next'

import {
  ApplicationInput,
  AvailableCardFormats,
  BavariaCardType,
  Region,
} from '../../../../graphql'
import { useUpdateStateCallback } from '../../hooks/useUpdateStateCallback'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
} from '../../util/compoundFormUtils'
import { Form, FormComponentProps, ValidationResult } from '../../util/formType'
import PersonalDataForm from './PersonalDataForm'
import StepCardTypeForm from './StepCardTypeForm'
import StepRequirementsForm from './StepRequirementsForm'
import StepSendForm from './StepSendForm'
import SteppedSubForms, { useFormAsStep } from './SteppedSubForms'

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
type AdditionalProps = { onSubmit: () => void; loading: boolean }

const isPhysicalCardAvailable = (regions: Region[], selectedRegionId: string): boolean =>
  regions.find(region => region.id.toString() === selectedRegionId)?.availableCardFormats !==
  AvailableCardFormats.Digital

const ApplicationForm: Form<State, ValidatedInput, AdditionalProps, Options> = {
  initialState: {
    ...createCompoundInitialState(SubForms),
    activeStep: 0,
  },
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: (state, options): ValidationResult<ValidatedInput> => {
    const stepPersonalData = PersonalDataForm.validate(state.stepPersonalData, options)
    const stepCardType = StepCardTypeForm.validate(state.stepCardType, {
      physicalCardAvailable: isPhysicalCardAvailable(
        options.regions,
        state.stepPersonalData.region.region.selectedValue,
      ),
    })
    if (stepPersonalData.type === 'error' || stepCardType.type === 'error') {
      return { type: 'error' }
    }

    const stepRequirements = StepRequirementsForm.validate(state.stepRequirements, {
      cardType: stepCardType.value.cardType,
    })
    const stepSend = StepSendForm.validate(state.stepSend)
    if (stepRequirements.type === 'error' || stepSend.type === 'error') {
      return { type: 'error' }
    }

    const { region, ...personalDataInput } = stepPersonalData.value

    return {
      type: 'valid',
      value: [
        region.regionId,
        {
          personalData: personalDataInput,
          applicationDetails: {
            cardType: stepCardType.value.cardType,
            applicationType: stepCardType.value.applicationType,
            wantsDigitalCard: stepCardType.value.wantsDigitalCard,
            wantsPhysicalCard: stepCardType.value.wantsPhysicalCard,
            blueCardEntitlement:
              stepRequirements.value.type === BavariaCardType.Blue
                ? stepRequirements.value.value
                : null,
            goldenCardEntitlement:
              stepRequirements.value.type === BavariaCardType.Golden
                ? stepRequirements.value.value
                : null,
            hasAcceptedPrivacyPolicy: stepSend.value.hasAcceptedDataPrivacy,
            givenInformationIsCorrectAndComplete:
              stepSend.value.givenInformationIsCorrectAndComplete,
            hasAcceptedEmailUsage: stepSend.value.hasAcceptedEmailUsage,
          },
        },
      ],
    }
  },
  Component: ({
    state,
    setState,
    options,
    onSubmit,
    loading,
  }: FormComponentProps<State, AdditionalProps, Options>) => {
    const { t } = useTranslation('applicationForms')
    const steps = [
      useFormAsStep(
        t('applicationStepPersonalData'),
        PersonalDataForm,
        state,
        setState,
        'stepPersonalData',
        { regions: options.regions },
        {},
      ),
      useFormAsStep(
        'Kartentyp',
        StepCardTypeForm,
        state,
        setState,
        'stepCardType',
        {
          physicalCardAvailable: isPhysicalCardAvailable(
            options.regions,
            state.stepPersonalData.region.region.selectedValue,
          ),
        },
        {},
      ),
      useFormAsStep(
        t('applicationStepRequirements'),
        StepRequirementsForm,
        state,
        setState,
        'stepRequirements',
        { cardType: state.stepCardType.cardType.selectedValue },
        {
          applicantName: `${state.stepPersonalData.forenames.shortText} ${state.stepPersonalData.surname.shortText}`,
        },
      ),
      useFormAsStep(
        t('applicationStepSubmit'),
        StepSendForm,
        state,
        setState,
        'stepSend',
        {},
        { regionId: state.stepPersonalData.region.region.selectedValue },
      ),
    ]

    return (
      <SteppedSubForms
        activeStep={state.activeStep}
        setActiveStep={useUpdateStateCallback(setState, 'activeStep')}
        subForms={steps}
        onSubmit={onSubmit}
        loading={loading}
      />
    )
  },
}

export default ApplicationForm
