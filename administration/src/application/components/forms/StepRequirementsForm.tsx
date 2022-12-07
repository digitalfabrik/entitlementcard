import { BlueCardEntitlementInput } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import BlueCardEntitlementForm, { BlueCardEntitlementFormState } from './BlueCardEntitlementForm'

export type StepRequirementsFormState = {
  blueCardEntitlement: BlueCardEntitlementFormState
  goldenCardEntitlement: null // TODO: Add golden card entitlement, too
}
type ValidatedInput = BlueCardEntitlementInput
type Options = {}
type AdditionalProps = {}
const StepRequirementsForm: Form<StepRequirementsFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: {
    blueCardEntitlement: BlueCardEntitlementForm.initialState,
    goldenCardEntitlement: null,
  },
  getArrayBufferKeys: state => [...BlueCardEntitlementForm.getArrayBufferKeys(state.blueCardEntitlement)],
  getValidatedInput: state => {
    const blueCardEntitlement = BlueCardEntitlementForm.getValidatedInput(state.blueCardEntitlement)
    if (blueCardEntitlement.type === 'error') return { type: 'error' }
    return { type: 'valid', value: blueCardEntitlement.value }
  },
  Component: ({ state, setState }) => {
    // TODO: Switch between blue and golden card entitlement depending on an option
    return (
      <BlueCardEntitlementForm.Component
        state={state.blueCardEntitlement}
        setState={useUpdateStateCallback(setState, 'blueCardEntitlement')}
      />
    )
  },
}

export default StepRequirementsForm
