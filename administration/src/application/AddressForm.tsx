import { AddressInput } from '../generated/graphql'
import { convertRequiredStringFormStateToInput, RequiredStringForm } from './RequiredStringForm'

export type AddressFormState = AddressInput

export const initialAddressFormState: AddressFormState = {
  addressSupplement: '',
  houseNumber: '',
  location: '',
  postalCode: '',
  street: '',
}

export const AddressForm = ({
  state,
  setState,
}: {
  state: AddressFormState
  setState: (value: AddressFormState) => void
}) => {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: '3' }}>
          <RequiredStringForm state={state.street} setState={street => setState({ ...state, street })} label='Straße' />
        </div>
        <div style={{ flex: '1' }}>
          <RequiredStringForm
            state={state.houseNumber}
            setState={houseNumber => setState({ ...state, houseNumber })}
            label='Hausnummer'
          />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: '1' }}>
          <RequiredStringForm
            state={state.postalCode}
            setState={postalCode => setState({ ...state, postalCode })}
            label='Postleitzahl'
          />
        </div>
        <div style={{ flex: '3' }}>
          <RequiredStringForm
            state={state.location}
            setState={location => setState({ ...state, location })}
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
