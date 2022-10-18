import { OrganizationInput } from '../generated/graphql'
import { AddressForm, AddressFormState, convertAddressFormStateToInput, initialAddressFormState } from './AddressForm'
import { RequiredEmailForm } from './RequiredEmailForm'
import { convertRequiredStringFormStateToInput, RequiredStringForm } from './RequiredStringForm'

export type OrganizationFormState = {
  amountOfWork: number
  name: string
  addressFormState: AddressFormState
  contactName: string
  contactEmail: string
  contactPhone: string
  contactHasConfirmedDataProcessing: boolean
}

export const initialOrganizationFormState: OrganizationFormState = {
  amountOfWork: 0,
  name: '',
  addressFormState: initialAddressFormState,
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  contactHasConfirmedDataProcessing: false,
}

export const OrganizationForm = ({
  state,
  setState,
}: {
  state: OrganizationFormState
  setState: (value: OrganizationFormState) => void
}) => {
  return (
    <>
      <h4>Angaben zur Organisation</h4>
      <RequiredStringForm
        state={state.name}
        setState={name => setState({ ...state, name })}
        label={'Name der Organisation bzw. des Vereins'}
      />
      <AddressForm
        state={state.addressFormState}
        setState={addressFormState => setState({ ...state, addressFormState })}
      />
      <h4>Kontaktperson der Organisation</h4>
      <RequiredStringForm
        state={state.contactName}
        setState={contactName => setState({ ...state, contactName })}
        label='Vor- und Nachname'
      />
      <RequiredEmailForm
        state={state.contactEmail}
        setState={contactEmail => setState({ ...state, contactEmail })}
        label='E-Mail-Adresse'
      />
    </>
  )
}

export const convertOrganizationFormStateToInput = (state: OrganizationFormState): OrganizationInput => {
  return {
    name: convertRequiredStringFormStateToInput(state.name),
    address: convertAddressFormStateToInput(state.addressFormState),
    category: 'hi',
    contact: { email: 'asdf', name: 'asdf', hasGivenPermission: false, telephone: '' },
  }
}
