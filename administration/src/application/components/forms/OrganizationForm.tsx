import { OrganizationInput } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import ShortTextForm from '../primitive-inputs/ShortTextForm'
import AddressForm from './AddressForm'
import SelectForm from '../primitive-inputs/SelectForm'
import EmailForm from '../primitive-inputs/EmailForm'
import CheckboxForm from '../primitive-inputs/CheckboxForm'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundValidate,
  createCompoundInitialState,
} from '../../compoundFormUtils'

const organizationCategoryOptions = {
  items: [
    'Soziales/Jugend/Senioren',
    'Tierschutz',
    'Sport',
    'Bildung',
    'Umwelt-/Naturschutz',
    'Kultur',
    'Gesundheit',
    'Katastrophenschutz/Feuerwehr/Rettungsdienst',
    'Kirchen',
    'Andere',
  ],
}

const contactHasGivenPermissionOptions = {
  required: true,
  notCheckedErrorMessage: 'Die Kontaktperson muss zugestimmt haben, damit Sie Ihren Antrag senden können.',
} as const

const SubForms = {
  name: ShortTextForm,
  address: AddressForm,
  category: SelectForm,
  contactName: ShortTextForm,
  contactEmail: EmailForm,
  contactPhone: ShortTextForm,
  contactHasGivenPermission: CheckboxForm,
}

const getValidatedCompoundInput = createCompoundValidate(SubForms, {
  contactHasGivenPermission: contactHasGivenPermissionOptions,
  category: organizationCategoryOptions,
})

type State = CompoundState<typeof SubForms>
type ValidatedInput = OrganizationInput
type Options = {}
type AdditionalProps = {}
const OrganizationForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: state => {
    const compoundResult = getValidatedCompoundInput(state)
    if (compoundResult.type === 'error') return compoundResult
    return {
      type: 'valid',
      value: {
        name: compoundResult.value.name,
        category: compoundResult.value.category,
        address: compoundResult.value.address,
        contact: {
          name: compoundResult.value.contactName,
          email: compoundResult.value.contactEmail,
          telephone: compoundResult.value.contactPhone,
          hasGivenPermission: compoundResult.value.contactHasGivenPermission,
        },
      },
    }
  },
  Component: ({ state, setState }) => (
    <>
      <h4>Angaben zur Organisation</h4>
      <ShortTextForm.Component
        state={state.name}
        setState={useUpdateStateCallback(setState, 'name')}
        label={'Name der Organisation bzw. des Vereins'}
      />
      <AddressForm.Component state={state.address} setState={useUpdateStateCallback(setState, 'address')} />
      <SelectForm.Component
        state={state.category}
        setState={useUpdateStateCallback(setState, 'category')}
        label='Einsatzgebiet'
        options={organizationCategoryOptions}
      />
      <h4>Kontaktperson der Organisation</h4>
      <ShortTextForm.Component
        state={state.contactName}
        setState={useUpdateStateCallback(setState, 'contactName')}
        label='Vor- und Nachname'
      />
      <EmailForm.Component
        state={state.contactEmail}
        setState={useUpdateStateCallback(setState, 'contactEmail')}
        label='E-Mail-Adresse'
      />
      <ShortTextForm.Component
        state={state.contactPhone}
        setState={useUpdateStateCallback(setState, 'contactPhone')}
        label='Telefon'
      />
      <CheckboxForm.Component
        state={state.contactHasGivenPermission}
        setState={useUpdateStateCallback(setState, 'contactHasGivenPermission')}
        label='Die Kontaktperson hat der Weitergabe seiner Daten zum Zwecke der Antragsverarbeitung zugestimmt.'
        options={contactHasGivenPermissionOptions}
      />
    </>
  ),
}

export default OrganizationForm
