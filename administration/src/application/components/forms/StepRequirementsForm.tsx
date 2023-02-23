import { BlueCardEntitlementInput, BavariaCardType, GoldenCardEntitlementInput } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import SwitchComponent from '../SwitchComponent'
import BlueCardEntitlementForm from './BlueCardEntitlementForm'
import GoldenCardEntitlementForm from './GoldenCardEntitlementForm'
import { CompoundState, createCompoundGetArrayBufferKeys, createCompoundInitialState } from '../../compoundFormUtils'

const SubForms = {
  blueCardEntitlement: BlueCardEntitlementForm,
  goldenCardEntitlement: GoldenCardEntitlementForm,
}
export type StepRequirementsFormState = CompoundState<typeof SubForms>
type ValidatedInput =
  | { type: BavariaCardType.Blue; value: BlueCardEntitlementInput }
  | { type: BavariaCardType.Golden; value: GoldenCardEntitlementInput }
type Options = { cardType: BavariaCardType | null }
type AdditionalProps = {}
const StepRequirementsForm: Form<StepRequirementsFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: (state, options) => {
    switch (options.cardType) {
      case BavariaCardType.Blue: {
        const blueCardEntitlement = BlueCardEntitlementForm.validate(state.blueCardEntitlement)
        if (blueCardEntitlement.type === 'error') return { type: 'error' }
        return { type: 'valid', value: { type: BavariaCardType.Blue, value: blueCardEntitlement.value } }
      }
      case BavariaCardType.Golden: {
        const goldenCardEntitlement = GoldenCardEntitlementForm.validate(state.goldenCardEntitlement)
        if (goldenCardEntitlement.type === 'error') return { type: 'error' }
        return { type: 'valid', value: { type: BavariaCardType.Golden, value: goldenCardEntitlement.value } }
      }
      default:
        return { type: 'error' }
    }
  },
  Component: ({ state, setState, options }) => (
    <SwitchComponent value={options.cardType}>
      {{
        [BavariaCardType.Blue]: (
          <SubForms.blueCardEntitlement.Component
            state={state.blueCardEntitlement}
            setState={useUpdateStateCallback(setState, 'blueCardEntitlement')}
          />
        ),
        [BavariaCardType.Golden]: (
          <SubForms.goldenCardEntitlement.Component
            state={state.goldenCardEntitlement}
            setState={useUpdateStateCallback(setState, 'goldenCardEntitlement')}
          />
        ),
      }}
    </SwitchComponent>
  ),
}

export default StepRequirementsForm
