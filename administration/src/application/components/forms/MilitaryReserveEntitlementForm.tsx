import { BlueCardMilitaryReserveEntitlementInput } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import FileInputForm, { FILE_SIZE_LIMIT_MEGA_BYTES } from '../primitive-inputs/FileInputForm'
import CustomDivider from '../CustomDivider'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundValidate,
  createCompoundInitialState,
} from '../../compoundFormUtils'

const SubForms = {
  certificate: FileInputForm,
}

type State = CompoundState<typeof SubForms>
type ValidatedInput = BlueCardMilitaryReserveEntitlementInput
type Options = {}
type AdditionalProps = {}
const MilitaryReserveEntitlementForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, {}),
  Component: ({ state, setState }) => (
    <>
      <CustomDivider label='Angaben zur Tätigkeit' />
      <h4>Tätigkeitsnachweis</h4>
      <p>
        Hängen Sie hier bitte einen eingescannten oder abfotografierten Tätigkeitsnachweis an. Die Datei darf maximal{' '}
        {FILE_SIZE_LIMIT_MEGA_BYTES} MB groß sein und muss im JPG, PNG oder PDF Format sein.
      </p>
      <FileInputForm.Component state={state.certificate} setState={useUpdateStateCallback(setState, 'certificate')} />
    </>
  ),
}

export default MilitaryReserveEntitlementForm
