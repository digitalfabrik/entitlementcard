import { PersonalDataInput } from '../../../generated/graphql'
import AddressForm, { AddressFormState } from './AddressForm'
import EmailForm, { EmailFormState } from '../primitive-inputs/EmailForm'
import ShortTextForm, { ShortTextFormState } from '../primitive-inputs/ShortTextForm'
import DateForm, { DateFormState } from '../primitive-inputs/DateForm'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import BasicDialog from "../BasicDialog";
import dataPrivacyBase from "../../../constants/dataPrivacyBase";
import { Checkbox, FormGroup } from '@mui/material'

export type PersonalDataFormState = {
  forenames: ShortTextFormState
  surname: ShortTextFormState
  addressFormState: AddressFormState
  emailAddress: EmailFormState
  telephone: ShortTextFormState
  dateOfBirth: DateFormState
  dataPrivacyAccepted: boolean,
  dataPrivacyModal: boolean
}
type ValidatedInput = PersonalDataInput
type Options = {}
type AdditionalProps = {}
const PersonalDataForm: Form<PersonalDataFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: {
    forenames: ShortTextForm.initialState,
    surname: ShortTextForm.initialState,
    addressFormState: AddressForm.initialState,
    emailAddress: EmailForm.initialState,
    telephone: ShortTextForm.initialState,
    dateOfBirth: DateForm.initialState,
    dataPrivacyAccepted: false,
    dataPrivacyModal: false
  },
  getArrayBufferKeys: state => [
    ...ShortTextForm.getArrayBufferKeys(state.forenames),
    ...ShortTextForm.getArrayBufferKeys(state.surname),
    ...AddressForm.getArrayBufferKeys(state.addressFormState),
    ...EmailForm.getArrayBufferKeys(state.emailAddress),
    ...ShortTextForm.getArrayBufferKeys(state.telephone),
    ...DateForm.getArrayBufferKeys(state.dateOfBirth),
  ],
  getValidatedInput: state => {
    const forenames = ShortTextForm.getValidatedInput(state.forenames)
    const surname = ShortTextForm.getValidatedInput(state.surname)
    const address = AddressForm.getValidatedInput(state.addressFormState)
    const emailAddress = EmailForm.getValidatedInput(state.emailAddress)
    const telephone = ShortTextForm.getValidatedInput(state.telephone)
    const dateOfBirth = DateForm.getValidatedInput(state.dateOfBirth)
    const dataPrivacyAccepted = state.dataPrivacyAccepted
    if (
      forenames.type === 'error' ||
      surname.type === 'error' ||
      address.type === 'error' ||
      emailAddress.type === 'error' ||
      telephone.type === 'error' ||
      dateOfBirth.type === 'error' ||
      dataPrivacyAccepted === false
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
          <ShortTextForm.Component
            state={state.forenames}
            setState={useUpdateStateCallback(setState, 'forenames')}
            label='Vorname(n)'
          />
        </div>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <ShortTextForm.Component
            state={state.surname}
            setState={useUpdateStateCallback(setState, 'surname')}
            label='Nachname'
          />
        </div>
      </div>
      <DateForm.Component
        state={state.dateOfBirth}
        setState={useUpdateStateCallback(setState, 'dateOfBirth')}
        label='Geburtsdatum'
      />
      <AddressForm.Component
        state={state.addressFormState}
        setState={useUpdateStateCallback(setState, 'addressFormState')}
      />
      <EmailForm.Component
        state={state.emailAddress}
        setState={useUpdateStateCallback(setState, 'emailAddress')}
        label='E-Mail-Adresse'
      />
      <ShortTextForm.Component
        state={state.telephone}
        setState={useUpdateStateCallback(setState, 'telephone')}
        label='Telefon'
      />
      <FormGroup row>
         <Checkbox
                checked={state.dataPrivacyAccepted}
                onChange={e => setState(state => ({...state, dataPrivacyAccepted: e.target.checked}))}
                required
            />
            <div style={{alignSelf: 'center'}}>Ich akzeptiere die <a onClick={()=>setState(state => ({...state, dataPrivacyModal: true}))}>Datenschutzerklärung</a></div>
      </FormGroup>
      <BasicDialog open={state.dataPrivacyModal} onUpdateOpen={()=>setState(state => ({...state, dataPrivacyModal: false}))} title={'Datenschutzerklärung'} content={dataPrivacyBase}/>
    </>
  ),
}

export default PersonalDataForm
