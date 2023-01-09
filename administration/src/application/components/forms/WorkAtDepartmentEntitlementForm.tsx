import { BlueCardWorkAtDepartmentEntitlementInput } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import ShortTextForm, { ShortTextFormState } from '../primitive-inputs/ShortTextForm'
import FileInputForm, { FILE_SIZE_LIMIT_MEGA_BYTES, FileInputFormState } from '../primitive-inputs/FileInputForm'
import CustomDivider from '../CustomDivider'
import OrganizationForm, { OrganizationFormState } from './OrganizationForm'

export type WorkAtDepartmentEntitlementFormState = {
  organization: OrganizationFormState
  responsibility: ShortTextFormState
  certificate: FileInputFormState
}
type ValidatedInput = BlueCardWorkAtDepartmentEntitlementInput
type Options = {}
type AdditionalProps = {}
const WorkAtDepartmentEntitlementForm: Form<
  WorkAtDepartmentEntitlementFormState,
  Options,
  ValidatedInput,
  AdditionalProps
> = {
  initialState: {
    organization: OrganizationForm.initialState,
    responsibility: ShortTextForm.initialState,
    certificate: FileInputForm.initialState,
  },
  getArrayBufferKeys: state => [
    ...OrganizationForm.getArrayBufferKeys(state.organization),
    ...ShortTextForm.getArrayBufferKeys(state.responsibility),
    ...FileInputForm.getArrayBufferKeys(state.certificate),
  ],
  getValidatedInput: state => {
    const organization = OrganizationForm.getValidatedInput(state.organization)
    const responsibility = ShortTextForm.getValidatedInput(state.responsibility)
    const certificate = FileInputForm.getValidatedInput(state.certificate)
    if (organization.type === 'error' || responsibility.type === 'error' || certificate.type === 'error')
      return { type: 'error' }
    return {
      type: 'valid',
      value: {
        organization: organization.value,
        responsibility: responsibility.value,
        certificate: certificate.value,
      },
    }
  },
  Component: ({ state, setState }) => (
    <>
      <CustomDivider label='Angaben zur Tätigkeit' />
      <OrganizationForm.Component
        state={state.organization}
        setState={useUpdateStateCallback(setState, 'organization')}
      />
      <ShortTextForm.Component
        label='Funktion oder Tätigkeit'
        state={state.responsibility}
        setState={useUpdateStateCallback(setState, 'responsibility')}
      />
      <h4>Tätigkeitsnachweis</h4>
      <p>
        Hängen Sie hier bitte einen eingescannten oder abfotografierten Tätigkeitsnachweis an. Die Datei darf maximal{' '}
        {FILE_SIZE_LIMIT_MEGA_BYTES} MB groß sein und muss im JPG, PNG oder PDF Format sein.
      </p>
      <FileInputForm.Component state={state.certificate} setState={useUpdateStateCallback(setState, 'certificate')} />
    </>
  ),
}

export default WorkAtDepartmentEntitlementForm
