import { BlueCardVolunteerServiceEntitlementInput } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../hooks/useUpdateStateCallback'
import { Form } from '../util/FormType'
import ShortTextForm from '../primitive-inputs/ShortTextForm'
import FileInputForm, { FileRequirementsText } from '../primitive-inputs/FileInputForm'
import CustomDivider from '../CustomDivider'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundValidate,
  createCompoundInitialState,
} from '../util/compoundFormUtils'

const SubForms = {
  programName: ShortTextForm,
  certificate: FileInputForm,
}

type State = CompoundState<typeof SubForms>
type ValidatedInput = BlueCardVolunteerServiceEntitlementInput
type Options = {}
type AdditionalProps = {}
const VolunteerServiceEntitlementForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, {}),
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
        Hängen Sie hier bitte einen eingescannten oder abfotografierten Tätigkeitsnachweis an. {FileRequirementsText}
      </p>
      <FileInputForm.Component state={state.certificate} setState={useUpdateStateCallback(setState, 'certificate')} />
    </>
  ),
}

export default VolunteerServiceEntitlementForm
