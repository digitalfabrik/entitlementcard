import { AddressInput } from '../../../generated/graphql'
import ShortTextForm from '../primitive-inputs/ShortTextForm'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundGetValidatedInput,
  createCompoundInitialState,
} from '../../compoundFormUtils'

const AddressCompounds = {
  street: ShortTextForm,
  houseNumber: ShortTextForm,
  location: ShortTextForm,
  postalCode: ShortTextForm,
}

export type AddressFormState = CompoundState<typeof AddressCompounds>
type ValidatedInput = AddressInput
type Options = {}
type AdditionalProps = {}

const AddressForm: Form<AddressFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: createCompoundInitialState(AddressCompounds),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(AddressCompounds),
  getValidatedInput: createCompoundGetValidatedInput(AddressCompounds, {}),
  Component: ({ state, setState }) => (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div style={{ flex: '3' }}>
          <ShortTextForm.Component
            state={state.street}
            setState={useUpdateStateCallback(setState, 'street')}
            label='Straße'
          />
        </div>
        <div style={{ flex: '1' }}>
          <ShortTextForm.Component
            state={state.houseNumber}
            setState={useUpdateStateCallback(setState, 'houseNumber')}
            label='Hausnummer'
            minWidth={100}
          />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div style={{ flex: '1' }}>
          <ShortTextForm.Component
            state={state.postalCode}
            setState={useUpdateStateCallback(setState, 'postalCode')}
            label='Postleitzahl'
          />
        </div>
        <div style={{ flex: '3' }}>
          <ShortTextForm.Component
            state={state.location}
            setState={useUpdateStateCallback(setState, 'location')}
            label='Ort'
          />
        </div>
      </div>
    </>
  ),
}

export default AddressForm
