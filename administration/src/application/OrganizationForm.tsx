import { OrganizationInput } from '../generated/graphql'
import { AddressForm, AddressFormState, convertAddressFormStateToInput, initialAddressFormState } from './AddressForm'
import { convertRequiredEmailFormStateToInput, RequiredEmailForm } from './RequiredEmailForm'
import { convertRequiredStringFormStateToInput, RequiredStringForm } from './RequiredStringForm'
import {
  convertOrganizationCategoryFormStateToInput,
  initialOrganizationCategoryFormState,
  OrganizationCategoryForm,
  OrganizationCategoryFormState,
} from './OrganizationCategory'

export type OrganizationFormState = {
  amountOfWork: number
  name: string
  addressFormState: AddressFormState
  categoryFormState: OrganizationCategoryFormState
  contactName: string
  contactEmail: string
  contactPhone: string
  contactHasConfirmedDataProcessing: boolean
}

export const initialOrganizationFormState: OrganizationFormState = {
  amountOfWork: 0,
  name: '',
  addressFormState: initialAddressFormState,
  categoryFormState: initialOrganizationCategoryFormState,
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
      <OrganizationCategoryForm
        state={state.categoryFormState}
        setState={categoryFormState => setState({ ...state, categoryFormState })}
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
      <RequiredStringForm
        state={state.contactPhone}
        setState={contactPhone => setState({ ...state, contactPhone })}
        label='Telefon'
      />
    </>
  )
}

export const convertOrganizationFormStateToInput = (state: OrganizationFormState): OrganizationInput => {
  return {
    name: convertRequiredStringFormStateToInput(state.name),
    address: convertAddressFormStateToInput(state.addressFormState),
    category: convertOrganizationCategoryFormStateToInput(state.categoryFormState),
    contact: {
      email: convertRequiredEmailFormStateToInput(state.contactEmail),
      name: convertRequiredStringFormStateToInput(state.contactName),
      hasGivenPermission: state.contactHasConfirmedDataProcessing,
      telephone: convertRequiredStringFormStateToInput(state.contactPhone),
    },
  }
}
