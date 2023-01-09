import { OrganizationInput } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import ShortTextForm, { ShortTextFormState } from '../primitive-inputs/ShortTextForm'
import AddressForm, { AddressFormState } from './AddressForm'
import SelectForm, { SelectFormState } from '../primitive-inputs/SelectForm'
import EmailForm, { EmailFormState } from '../primitive-inputs/EmailForm'
import CheckboxForm, { CheckboxFormState } from '../primitive-inputs/CheckboxForm'

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

export type OrganizationFormState = {
  name: ShortTextFormState
  address: AddressFormState
  category: SelectFormState
  contactName: ShortTextFormState
  contactEmail: EmailFormState
  contactPhone: ShortTextFormState
  contactHasGivenPermission: CheckboxFormState
}
type ValidatedInput = OrganizationInput
type Options = {}
type AdditionalProps = {}
const OrganizationForm: Form<OrganizationFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: {
    name: ShortTextForm.initialState,
    address: AddressForm.initialState,
    category: SelectForm.initialState,
    contactName: ShortTextForm.initialState,
    contactEmail: EmailForm.initialState,
    contactPhone: ShortTextForm.initialState,
    contactHasGivenPermission: CheckboxForm.initialState,
  },
  getArrayBufferKeys: state => [
    ...ShortTextForm.getArrayBufferKeys(state.name),
    ...AddressForm.getArrayBufferKeys(state.address),
    ...SelectForm.getArrayBufferKeys(state.category),
    ...ShortTextForm.getArrayBufferKeys(state.contactName),
    ...EmailForm.getArrayBufferKeys(state.contactEmail),
    ...ShortTextForm.getArrayBufferKeys(state.contactPhone),
    ...CheckboxForm.getArrayBufferKeys(state.contactHasGivenPermission),
  ],
  getValidatedInput: state => {
    const name = ShortTextForm.getValidatedInput(state.name)
    const address = AddressForm.getValidatedInput(state.address)
    const category = SelectForm.getValidatedInput(state.category, organizationCategoryOptions)
    const contactName = ShortTextForm.getValidatedInput(state.contactName)
    const contactEmail = EmailForm.getValidatedInput(state.contactEmail)
    const contactPhone = ShortTextForm.getValidatedInput(state.contactPhone)
    const contactHasGivenPermission = CheckboxForm.getValidatedInput(
      state.contactHasGivenPermission,
      contactHasGivenPermissionOptions
    )
    if (
      name.type === 'error' ||
      address.type === 'error' ||
      category.type === 'error' ||
      contactName.type === 'error' ||
      contactEmail.type === 'error' ||
      contactPhone.type === 'error' ||
      contactHasGivenPermission.type === 'error'
    )
      return { type: 'error' }
    return {
      type: 'valid',
      value: {
        name: name.value,
        address: address.value,
        category: category.value,
        contact: {
          name: contactName.value,
          email: contactEmail.value,
          telephone: contactPhone.value,
          hasGivenPermission: contactHasGivenPermission.value,
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
