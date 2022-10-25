import { AddressInput } from '../../../generated/graphql'
import {
  convertRequiredStringFormStateToInput,
  initialRequiredStringFormState,
  RequiredStringForm,
} from '../primitive-inputs/RequiredStringForm'
import { SetState, useUpdateStateCallback } from './useUpdateStateCallback'

export type AddressFormState = AddressInput

export const initialAddressFormState: AddressFormState = {
  addressSupplement: initialRequiredStringFormState,
  houseNumber: initialRequiredStringFormState,
  location: initialRequiredStringFormState,
  postalCode: initialRequiredStringFormState,
  street: initialRequiredStringFormState,
}

export const AddressForm = ({ state, setState }: { state: AddressFormState; setState: SetState<AddressFormState> }) => {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div style={{ flex: '3' }}>
          <RequiredStringForm
            state={state.street}
            setState={useUpdateStateCallback(setState, 'street')}
            label='Straße'
          />
        </div>
        <div style={{ flex: '1' }}>
          <RequiredStringForm
            state={state.houseNumber}
            setState={useUpdateStateCallback(setState, 'houseNumber')}
            label='Hausnummer'
            minWidth={100}
          />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div style={{ flex: '1' }}>
          <RequiredStringForm
            state={state.postalCode}
            setState={useUpdateStateCallback(setState, 'postalCode')}
            label='Postleitzahl'
          />
        </div>
        <div style={{ flex: '3' }}>
          <RequiredStringForm
            state={state.location}
            setState={useUpdateStateCallback(setState, 'location')}
            label='Ort'
          />
        </div>
      </div>
    </>
  )
}

export const convertAddressFormStateToInput = (state: AddressFormState): AddressInput => {
  return {
    street: convertRequiredStringFormStateToInput(state.street),
    postalCode: convertRequiredStringFormStateToInput(state.postalCode),
    houseNumber: convertRequiredStringFormStateToInput(state.houseNumber),
    location: convertRequiredStringFormStateToInput(state.location),
  }
}
