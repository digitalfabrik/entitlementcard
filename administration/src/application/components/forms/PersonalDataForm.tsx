import { PersonalDataInput } from '../../../generated/graphql'
import AddressForm from './AddressForm'
import EmailForm from '../primitive-inputs/EmailForm'
import ShortTextForm from '../primitive-inputs/ShortTextForm'
import DateForm from '../primitive-inputs/DateForm'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import CustomDivider from '../CustomDivider'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundGetValidatedInput,
  createCompoundInitialState,
} from '../../compoundFormUtils'

const SubForms = {
  forenames: ShortTextForm,
  surname: ShortTextForm,
  address: AddressForm,
  emailAddress: EmailForm,
  telephone: ShortTextForm,
  dateOfBirth: DateForm,
}

type State = CompoundState<typeof SubForms>
type ValidatedInput = PersonalDataInput
type Options = {}
type AdditionalProps = {}
const PersonalDataForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  getValidatedInput: createCompoundGetValidatedInput(SubForms, {}),
  Component: ({ state, setState }) => (
    <>
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
      <CustomDivider label='Adresse (Erstwohnsitz)' />
      <AddressForm.Component state={state.address} setState={useUpdateStateCallback(setState, 'address')} />
      <CustomDivider label='Weitere Angaben' />
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
      <DateForm.Component
        state={state.dateOfBirth}
        setState={useUpdateStateCallback(setState, 'dateOfBirth')}
        label='Geburtsdatum'
      />
    </>
  ),
}

export default PersonalDataForm
