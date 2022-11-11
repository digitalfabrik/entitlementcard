import { PersonalDataInput } from '../../../generated/graphql'
import addressForm, { AddressFormState } from './AddressForm'
import emailForm, { EmailFormState } from '../primitive-inputs/EmailForm'
import shortTextForm, { ShortTextFormState } from '../primitive-inputs/ShortTextForm'
import dateForm, { DateFormState } from '../primitive-inputs/DateForm'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'

export type PersonalDataFormState = {
  forenames: ShortTextFormState
  surname: ShortTextFormState
  addressFormState: AddressFormState
  emailAddress: EmailFormState
  telephone: ShortTextFormState
  dateOfBirth: DateFormState
}
type ValidatedInput = PersonalDataInput
type Options = {}
type AdditionalProps = {}
const personalDataForm: Form<PersonalDataFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: {
    forenames: shortTextForm.initialState,
    surname: shortTextForm.initialState,
    addressFormState: addressForm.initialState,
    emailAddress: emailForm.initialState,
    telephone: shortTextForm.initialState,
    dateOfBirth: dateForm.initialState,
  },
  getValidatedInput: state => {
    const forenames = shortTextForm.getValidatedInput(state.forenames)
    const surname = shortTextForm.getValidatedInput(state.surname)
    const address = addressForm.getValidatedInput(state.addressFormState)
    const emailAddress = emailForm.getValidatedInput(state.emailAddress)
    const telephone = shortTextForm.getValidatedInput(state.telephone)
    const dateOfBirth = dateForm.getValidatedInput(state.dateOfBirth)
    if (
      forenames.type === 'error' ||
      surname.type === 'error' ||
      address.type === 'error' ||
      emailAddress.type === 'error' ||
      telephone.type === 'error' ||
      dateOfBirth.type === 'error'
    )
      return { type: 'error' }
    return {
      type: 'valid',
      value: {
        forenames: forenames.value,
        surname: surname.value,
        address: address.value,
        emailAddress: emailAddress.value,
        telephone: telephone.value,
        dateOfBirth: dateOfBirth.value,
      },
    }
  },
  Component: ({ state, setState }) => (
    <>
      <h3>Persönliche Angaben</h3>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <shortTextForm.Component
            state={state.forenames}
            setState={useUpdateStateCallback(setState, 'forenames')}
            label='Vorname(n)'
          />
        </div>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <shortTextForm.Component
            state={state.surname}
            setState={useUpdateStateCallback(setState, 'surname')}
            label='Nachname'
          />
        </div>
      </div>
      <dateForm.Component
        state={state.dateOfBirth}
        setState={useUpdateStateCallback(setState, 'dateOfBirth')}
        label='Geburtsdatum'
      />
      <addressForm.Component
        state={state.addressFormState}
        setState={useUpdateStateCallback(setState, 'addressFormState')}
      />
      <emailForm.Component
        state={state.emailAddress}
        setState={useUpdateStateCallback(setState, 'emailAddress')}
        label='E-Mail-Adresse'
      />
      <shortTextForm.Component
        state={state.telephone}
        setState={useUpdateStateCallback(setState, 'telephone')}
        label='Telefon'
      />
    </>
  ),
}

export default personalDataForm
