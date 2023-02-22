import { PersonalDataInput } from '../../../generated/graphql'
import AddressForm from './AddressForm'
import EmailForm from '../primitive-inputs/EmailForm'
import ShortTextForm, { OptionalShortTextForm } from '../primitive-inputs/ShortTextForm'
import DateForm from '../primitive-inputs/DateForm'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import CustomDivider from '../CustomDivider'
import { sub } from 'date-fns'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundValidate,
  createCompoundInitialState,
} from '../../compoundFormUtils'

const SubForms = {
  forenames: ShortTextForm,
  surname: ShortTextForm,
  address: AddressForm,
  emailAddress: EmailForm,
  telephone: OptionalShortTextForm,
  dateOfBirth: DateForm,
}

const dateOfBirthOptions = {
  maximumDate: sub(Date.now(), { years: 16 }),
  maximumDateErrorMessage: 'Sie müssen mindestens 16 Jahre alt sein, um eine Ehrenamtskarte beantragen zu können.',
} as const

type State = CompoundState<typeof SubForms>
type ValidatedInput = PersonalDataInput
type Options = {}
type AdditionalProps = {}
const PersonalDataForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, { dateOfBirth: dateOfBirthOptions }),
  Component: ({ state, setState }) => (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <SubForms.forenames.Component
            state={state.forenames}
            setState={useUpdateStateCallback(setState, 'forenames')}
            label='Vorname(n)'
          />
        </div>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <SubForms.surname.Component
            state={state.surname}
            setState={useUpdateStateCallback(setState, 'surname')}
            label='Nachname'
          />
        </div>
      </div>
      <CustomDivider label='Adresse (Erstwohnsitz)' />
      <SubForms.address.Component state={state.address} setState={useUpdateStateCallback(setState, 'address')} />
      <CustomDivider label='Weitere Angaben' />
      <SubForms.emailAddress.Component
        state={state.emailAddress}
        setState={useUpdateStateCallback(setState, 'emailAddress')}
        label='E-Mail-Adresse'
      />
      <SubForms.telephone.Component
        state={state.telephone}
        setState={useUpdateStateCallback(setState, 'telephone')}
        label='Telefon'
      />
      <SubForms.dateOfBirth.Component
        state={state.dateOfBirth}
        setState={useUpdateStateCallback(setState, 'dateOfBirth')}
        label='Geburtsdatum'
        options={dateOfBirthOptions}
      />
    </>
  ),
}

export default PersonalDataForm
