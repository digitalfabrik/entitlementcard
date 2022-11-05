import { AddressInput } from '../../../generated/graphql'
import shortTextForm, { ShortTextFormState } from '../primitive-inputs/ShortTextForm'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'

export type AddressFormState = {
  street: ShortTextFormState
  houseNumber: ShortTextFormState
  location: ShortTextFormState
  postalCode: ShortTextFormState
}
type ValidatedInput = AddressInput
type Options = void
type AdditionalProps = {}
const addressForm: Form<AddressFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: {
    street: shortTextForm.initialState,
    houseNumber: shortTextForm.initialState,
    location: shortTextForm.initialState,
    postalCode: shortTextForm.initialState,
  },
  getValidatedInput: state => {
    const street = shortTextForm.getValidatedInput(state.street)
    const houseNumber = shortTextForm.getValidatedInput(state.street)
    const location = shortTextForm.getValidatedInput(state.street)
    const postalCode = shortTextForm.getValidatedInput(state.street)
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
          <shortTextForm.Component
            state={state.street}
            setState={useUpdateStateCallback(setState, 'street')}
            label='Straße'
          />
        </div>
        <div style={{ flex: '1' }}>
          <shortTextForm.Component
            state={state.houseNumber}
            setState={useUpdateStateCallback(setState, 'houseNumber')}
            label='Hausnummer'
            minWidth={100}
          />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div style={{ flex: '1' }}>
          <shortTextForm.Component
            state={state.postalCode}
            setState={useUpdateStateCallback(setState, 'postalCode')}
            label='Postleitzahl'
          />
        </div>
        <div style={{ flex: '3' }}>
          <shortTextForm.Component
            state={state.location}
            setState={useUpdateStateCallback(setState, 'location')}
            label='Ort'
          />
        </div>
      </div>
    </>
  ),
}

export default addressForm
