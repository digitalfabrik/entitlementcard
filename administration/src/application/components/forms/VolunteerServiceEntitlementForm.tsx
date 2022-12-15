import {
  BlueCardVolunteerServiceEntitlementInput,
} from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import ShortTextForm, { ShortTextFormState } from '../primitive-inputs/ShortTextForm'
import FileInputForm, { FILE_SIZE_LIMIT_MEGA_BYTES, FileInputFormState } from '../primitive-inputs/FileInputForm'
import CustomDivider from '../CustomDivider'

export type VolunteerServiceEntitlementFormState = {
  programName: ShortTextFormState
  certificate: FileInputFormState
}
type ValidatedInput = BlueCardVolunteerServiceEntitlementInput
type Options = {}
type AdditionalProps = {}
const VolunteerServiceEntitlementForm: Form<
  VolunteerServiceEntitlementFormState,
  Options,
  ValidatedInput,
  AdditionalProps
> = {
  initialState: {
    programName: ShortTextForm.initialState,
    certificate: FileInputForm.initialState,
  },
  getArrayBufferKeys: state => [
    ...ShortTextForm.getArrayBufferKeys(state.programName),
    ...FileInputForm.getArrayBufferKeys(state.certificate),
  ],
  getValidatedInput: state => {
    const programName = ShortTextForm.getValidatedInput(state.programName)
    const certificate = FileInputForm.getValidatedInput(state.certificate)
    if (programName.type === 'error' || certificate.type === 'error')
      return { type: 'error' }
    return {
      type: 'valid',
      value: {
        programName: programName.value,
        certificate: certificate.value,
      },
    }
  },
  Component: ({ state, setState }) => (
    <>
      <CustomDivider label='Angaben zur Tätigkeit' />
      <ShortTextForm.Component
        label='Name des Programms'
        state={state.programName}
        setState={useUpdateStateCallback(setState, 'programName')}
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

export default VolunteerServiceEntitlementForm
