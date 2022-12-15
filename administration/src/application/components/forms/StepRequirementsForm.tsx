import { BlueCardEntitlementInput, CardType, GoldenCardEntitlementInput } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import SwitchComponent from '../SwitchComponent'
import BlueCardEntitlementForm, { BlueCardEntitlementFormState } from './BlueCardEntitlementForm'
import GoldenCardEntitlementForm, { GoldenCardEntitlementFormState } from './GoldenCardEntitlementForm'

export type StepRequirementsFormState = {
  blueCardEntitlement: BlueCardEntitlementFormState
  goldenCardEntitlement: GoldenCardEntitlementFormState
}
type ValidatedInput =
  | { type: CardType.Blue; value: BlueCardEntitlementInput }
  | { type: CardType.Golden; value: GoldenCardEntitlementInput }
type Options = { cardType: CardType | null }
type AdditionalProps = {}
const StepRequirementsForm: Form<StepRequirementsFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: {
    blueCardEntitlement: BlueCardEntitlementForm.initialState,
    goldenCardEntitlement: GoldenCardEntitlementForm.initialState,
  },
  getArrayBufferKeys: state => [
    ...BlueCardEntitlementForm.getArrayBufferKeys(state.blueCardEntitlement),
    ...GoldenCardEntitlementForm.getArrayBufferKeys(state.goldenCardEntitlement),
  ],
  getValidatedInput: (state, options) => {
    switch (options.cardType) {
      case CardType.Blue: {
        const blueCardEntitlement = BlueCardEntitlementForm.getValidatedInput(state.blueCardEntitlement)
        if (blueCardEntitlement.type === 'error') return { type: 'error' }
        return { type: 'valid', value: { type: CardType.Blue, value: blueCardEntitlement.value } }
      }
      case CardType.Golden: {
        const goldenCardEntitlement = GoldenCardEntitlementForm.getValidatedInput(state.goldenCardEntitlement)
        if (goldenCardEntitlement.type === 'error') return { type: 'error' }
        return { type: 'valid', value: { type: CardType.Golden, value: goldenCardEntitlement.value } }
      }
      default:
        return { type: 'error' }
    }
  },
  Component: ({ state, setState, options }) => (
    <SwitchComponent value={options.cardType}>
      {{
        [CardType.Blue]: (
          <BlueCardEntitlementForm.Component
            state={state.blueCardEntitlement}
            setState={useUpdateStateCallback(setState, 'blueCardEntitlement')}
          />
        ),
        [CardType.Golden]: (
          <GoldenCardEntitlementForm.Component
            state={state.goldenCardEntitlement}
            setState={useUpdateStateCallback(setState, 'goldenCardEntitlement')}
          />
        ),
      }}
    </SwitchComponent>
  ),
}

export default StepRequirementsForm
