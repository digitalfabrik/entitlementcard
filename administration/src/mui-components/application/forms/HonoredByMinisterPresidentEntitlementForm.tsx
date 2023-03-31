import { GoldenCardHonoredByMinisterPresidentEntitlementInput } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../../hooks/useUpdateStateCallback'
import { Form } from '../util/FormType'
import FileInputForm, { FileRequirementsText } from '../primitive-inputs/FileInputForm'
import CustomDivider from '../CustomDivider'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundValidate,
  createCompoundInitialState,
} from '../util/compoundFormUtils'

const SubForms = { certificate: FileInputForm }

type State = CompoundState<typeof SubForms>
type ValidatedInput = GoldenCardHonoredByMinisterPresidentEntitlementInput
type Options = {}
type AdditionalProps = {}
const HonoredByMinisterPresidentEntitlementForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, {}),
  Component: ({ state, setState }) => (
    <>
      <CustomDivider label='Angaben zum Ehrenzeichen' />
      <h4>Urkunde</h4>
      <p>Hängen Sie hier bitte Ihre eingescannte oder abfotografierte Urkunde an. {FileRequirementsText}</p>
      <FileInputForm.Component state={state.certificate} setState={useUpdateStateCallback(setState, 'certificate')} />
    </>
  ),
}

export default HonoredByMinisterPresidentEntitlementForm
