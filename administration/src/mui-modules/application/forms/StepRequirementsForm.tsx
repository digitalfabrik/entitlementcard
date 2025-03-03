import React from 'react'

import { BavariaCardType, BlueCardEntitlementInput, GoldenCardEntitlementInput } from '../../../generated/graphql'
import SwitchComponent from '../SwitchComponent'
import { useUpdateStateCallback } from '../hooks/useUpdateStateCallback'
import { Form, FormComponentProps } from '../util/FormType'
import { CompoundState, createCompoundGetArrayBufferKeys, createCompoundInitialState } from '../util/compoundFormUtils'
import BlueCardEntitlementForm from './BlueCardEntitlementForm'
import GoldenCardEntitlementForm from './GoldenCardEntitlementForm'

const SubForms = {
  blueCardEntitlement: BlueCardEntitlementForm,
  goldenCardEntitlement: GoldenCardEntitlementForm,
}
export type StepRequirementsFormState = CompoundState<typeof SubForms>
type ValidatedInput =
  | { type: BavariaCardType.Blue; value: BlueCardEntitlementInput }
  | { type: BavariaCardType.Golden; value: GoldenCardEntitlementInput }
type Options = { cardType: BavariaCardType | null }
type AdditionalProps = { applicantName: string }
const StepRequirementsForm: Form<StepRequirementsFormState, ValidatedInput, AdditionalProps, Options> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: (state, options) => {
    switch (options.cardType) {
      case BavariaCardType.Blue: {
        const blueCardEntitlement = BlueCardEntitlementForm.validate(state.blueCardEntitlement)
        if (blueCardEntitlement.type === 'error') {
          return { type: 'error' }
        }
        return { type: 'valid', value: { type: BavariaCardType.Blue, value: blueCardEntitlement.value } }
      }
      case BavariaCardType.Golden: {
        const goldenCardEntitlement = GoldenCardEntitlementForm.validate(state.goldenCardEntitlement)
        if (goldenCardEntitlement.type === 'error') {
          return { type: 'error' }
        }
        return { type: 'valid', value: { type: BavariaCardType.Golden, value: goldenCardEntitlement.value } }
      }
      case null:
      default:
        return { type: 'error' }
    }
  },
  Component: ({
    state,
    setState,
    options,
    applicantName,
  }: FormComponentProps<StepRequirementsFormState, AdditionalProps, Options>) => (
    <SwitchComponent value={options.cardType}>
      {{
        [BavariaCardType.Blue]: (
          <SubForms.blueCardEntitlement.Component
            state={state.blueCardEntitlement}
            setState={useUpdateStateCallback(setState, 'blueCardEntitlement')}
            applicantName={applicantName}
          />
        ),
        [BavariaCardType.Golden]: (
          <SubForms.goldenCardEntitlement.Component
            state={state.goldenCardEntitlement}
            setState={useUpdateStateCallback(setState, 'goldenCardEntitlement')}
            applicantName={applicantName}
          />
        ),
      }}
    </SwitchComponent>
  ),
}

export default StepRequirementsForm
