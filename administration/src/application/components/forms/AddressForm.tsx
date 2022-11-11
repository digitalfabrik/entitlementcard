import { AddressInput } from '../../../generated/graphql'
import ShortTextForm, { ShortTextFormState } from '../primitive-inputs/ShortTextForm'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'

export type AddressFormState = {
  street: ShortTextFormState
  houseNumber: ShortTextFormState
  location: ShortTextFormState
  postalCode: ShortTextFormState
}
type ValidatedInput = AddressInput
type Options = {}
type AdditionalProps = {}
const AddressForm: Form<AddressFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: {
    street: ShortTextForm.initialState,
    houseNumber: ShortTextForm.initialState,
    location: ShortTextForm.initialState,
    postalCode: ShortTextForm.initialState,
  },
  getArrayBufferKeys: state => [
    ...ShortTextForm.getArrayBufferKeys(state.street),
    ...ShortTextForm.getArrayBufferKeys(state.houseNumber),
    ...ShortTextForm.getArrayBufferKeys(state.location),
    ...ShortTextForm.getArrayBufferKeys(state.postalCode),
  ],
  getValidatedInput: state => {
    const street = ShortTextForm.getValidatedInput(state.street)
    const houseNumber = ShortTextForm.getValidatedInput(state.houseNumber)
    const location = ShortTextForm.getValidatedInput(state.location)
    const postalCode = ShortTextForm.getValidatedInput(state.postalCode)
    if (
      street.type === 'error' ||
      houseNumber.type === 'error' ||
      location.type === 'error' ||
      postalCode.type === 'error'
    )
      return { type: 'error' }
    return {
      type: 'valid',
      value: {
        street: street.value,
        houseNumber: houseNumber.value,
        location: location.value,
        postalCode: postalCode.value,
      },
    }
  },
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
