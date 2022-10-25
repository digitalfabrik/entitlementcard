import { PersonalDataInput } from '../../../generated/graphql'
import { AddressForm, AddressFormState, convertAddressFormStateToInput, initialAddressFormState } from './AddressForm'
import {
  convertRequiredEmailFormStateToInput,
  initialRequiredEmailFormState,
  RequiredEmailForm,
  RequiredEmailFormState,
} from '../primitive-inputs/RequiredEmailForm'
import {
  convertRequiredStringFormStateToInput,
  initialRequiredStringFormState,
  RequiredStringForm,
  RequiredStringFormState,
} from '../primitive-inputs/RequiredStringForm'
import {
  convertDateFormStateToInput,
  DateForm,
  DateFormState,
  initialDateFormState,
} from '../primitive-inputs/DateForm'
import { SetState, useUpdateStateCallback } from './useUpdateStateCallback'

export type PersonalDataFormState = {
  forenames: RequiredStringFormState
  surname: RequiredStringFormState
  addressFormState: AddressFormState
  email: RequiredEmailFormState
  telephone: RequiredStringFormState
  dateOfBirth: DateFormState
}

export const initialPersonalDataFormState: PersonalDataFormState = {
  addressFormState: initialAddressFormState,
  forenames: initialRequiredStringFormState,
  surname: initialRequiredStringFormState,
  email: initialRequiredEmailFormState,
  telephone: initialRequiredStringFormState,
  dateOfBirth: initialDateFormState,
}

export const PersonalDataForm = ({
  state,
  setState,
}: {
  state: PersonalDataFormState
  setState: SetState<PersonalDataFormState>
}) => {
  return (
    <>
      <h3>Persönliche Angaben</h3>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <RequiredStringForm
            state={state.forenames}
            setState={useUpdateStateCallback(setState, 'forenames')}
            label={'Vorname(n)'}
          />
        </div>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <RequiredStringForm
            state={state.surname}
            setState={useUpdateStateCallback(setState, 'surname')}
            label={'Nachname'}
          />
        </div>
      </div>
      <DateForm
        state={state.dateOfBirth}
        setState={useUpdateStateCallback(setState, 'dateOfBirth')}
        label='Geburtsdatum'
      />
      <AddressForm state={state.addressFormState} setState={useUpdateStateCallback(setState, 'addressFormState')} />
      <RequiredEmailForm
        state={state.email}
        setState={useUpdateStateCallback(setState, 'email')}
        label='E-Mail-Adresse'
      />
      <RequiredStringForm
        state={state.telephone}
        setState={useUpdateStateCallback(setState, 'telephone')}
        label='Telefon'
      />
    </>
  )
}

export const convertPersonalDataFormStateToInput = (state: PersonalDataFormState): PersonalDataInput => {
  return {
    forenames: convertRequiredStringFormStateToInput(state.forenames),
    surname: convertRequiredStringFormStateToInput(state.surname),
    address: convertAddressFormStateToInput(state.addressFormState),
    emailAddress: convertRequiredEmailFormStateToInput(state.email),
    telephone: convertRequiredStringFormStateToInput(state.telephone),
    dateOfBirth: convertDateFormStateToInput(state.dateOfBirth),
  }
}
