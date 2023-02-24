import {PersonalDataInput, Region, ShortTextInput} from '../../../generated/graphql'
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
import RegionForm, {getOptions} from './RegionForm'

const SubForms = {
  forenames: ShortTextForm,
  surname: ShortTextForm,
  address: AddressForm,
  emailAddress: EmailForm,
  telephone: OptionalShortTextForm,
  dateOfBirth: DateForm,
  region: RegionForm,
}

const dateOfBirthOptions = {
  maximumDate: sub(Date.now(), { years: 16 }),
  maximumDateErrorMessage: 'Sie müssen mindestens 16 Jahre alt sein, um eine Ehrenamtskarte beantragen zu können.',
} as const

type State = CompoundState<typeof SubForms>
type ValidatedInput = PersonalDataInput
type Options = {}
type AdditionalProps = { regionData: Region[] }
const PersonalDataForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
// @ts-ignore // TODO fix issue
  validate: createCompoundValidate(SubForms, { dateOfBirth: dateOfBirthOptions}),
  Component: ({ state, setState, regionData }) => (
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
      <CustomDivider label='Region (wird ermittelt)' />
      <SubForms.region.Component
        state={state.region}
        setState={useUpdateStateCallback(setState, 'region')}
        regionData={regionData}
        postalCode={state.address.postalCode.shortText}
        options={{ items: getOptions(regionData) }}
      />
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
