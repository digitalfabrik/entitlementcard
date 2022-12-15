import { OrganizationInput } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import ShortTextForm, { ShortTextFormState } from '../primitive-inputs/ShortTextForm'
import AddressForm, { AddressFormState } from './AddressForm'
import SelectForm, { SelectFormState } from '../primitive-inputs/SelectForm'
import EmailForm, { EmailFormState } from '../primitive-inputs/EmailForm'

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

export type OrganizationFormState = {
  name: ShortTextFormState
  address: AddressFormState
  category: SelectFormState
  contactName: ShortTextFormState
  contactEmail: EmailFormState
  contactPhone: ShortTextFormState
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
  },
  getArrayBufferKeys: state => [
    ...ShortTextForm.getArrayBufferKeys(state.name),
    ...AddressForm.getArrayBufferKeys(state.address),
    ...SelectForm.getArrayBufferKeys(state.category),
    ...ShortTextForm.getArrayBufferKeys(state.contactName),
    ...EmailForm.getArrayBufferKeys(state.contactEmail),
    ...ShortTextForm.getArrayBufferKeys(state.contactPhone),
  ],
  getValidatedInput: state => {
    const name = ShortTextForm.getValidatedInput(state.name)
    const address = AddressForm.getValidatedInput(state.address)
    const category = SelectForm.getValidatedInput(state.category, organizationCategoryOptions)
    const contactName = ShortTextForm.getValidatedInput(state.contactName)
    const contactEmail = EmailForm.getValidatedInput(state.contactEmail)
    const contactPhone = ShortTextForm.getValidatedInput(state.contactPhone)
    if (
      name.type === 'error' ||
      address.type === 'error' ||
      category.type === 'error' ||
      contactName.type === 'error' ||
      contactEmail.type === 'error' ||
      contactPhone.type === 'error'
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
          hasGivenPermission: true, // TODO: Add a field for this.
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
    </>
  ),
}

export default OrganizationForm
