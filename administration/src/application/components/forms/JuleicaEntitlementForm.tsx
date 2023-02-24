import { BlueCardJuleicaEntitlementInput } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import DateForm from '../primitive-inputs/DateForm'
import ShortTextForm from '../primitive-inputs/ShortTextForm'
import FileInputForm, { FileRequirementsText } from '../primitive-inputs/FileInputForm'
import CustomDivider from '../CustomDivider'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundValidate,
  createCompoundInitialState,
} from '../../compoundFormUtils'

const SubForms = {
  juleicaNumber: ShortTextForm,
  juleicaExpirationDate: DateForm,
  copyOfJuleica: FileInputForm,
}
type State = CompoundState<typeof SubForms>
type ValidatedInput = BlueCardJuleicaEntitlementInput
type Options = {}
type AdditionalProps = {}
const JuleicaEntitlementForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, { juleicaExpirationDate: { maximumDate: null } }),
  Component: ({ state, setState }) => (
    <>
      <CustomDivider label='Angaben zur JuLeiCa' />
      <ShortTextForm.Component
        label='Kartennummer'
        state={state.juleicaNumber}
        setState={useUpdateStateCallback(setState, 'juleicaNumber')}
      />
      <DateForm.Component
        label='Karte gültig bis'
        state={state.juleicaExpirationDate}
        setState={useUpdateStateCallback(setState, 'juleicaExpirationDate')}
        options={{ maximumDate: null }}
      />
      <h4>Kopie der JuLeiCa</h4>
      <p>Hängen Sie hier bitte Ihre eingescannte oder abfotografierte JuLeiCa an. {FileRequirementsText}</p>
      <FileInputForm.Component
        state={state.copyOfJuleica}
        setState={useUpdateStateCallback(setState, 'copyOfJuleica')}
      />
    </>
  ),
}

export default JuleicaEntitlementForm
