import { BlueCardJuleicaEntitlementInput } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import DateForm from '../primitive-inputs/DateForm'
import ShortTextForm from '../primitive-inputs/ShortTextForm'
import FileInputForm, { FILE_SIZE_LIMIT_MEGA_BYTES } from '../primitive-inputs/FileInputForm'
import CustomDivider from '../CustomDivider'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundGetValidatedInput,
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
  getValidatedInput: createCompoundGetValidatedInput(SubForms, {}),
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
      />
      <h4> Kopie der JuLeiCa</h4>
      <p>
        Hängen Sie hier bitte Ihre eingescannte oder abfotografierte JuLeiCa an. Die Datei darf maximal{' '}
        {FILE_SIZE_LIMIT_MEGA_BYTES} MB groß sein und muss im JPG, PNG oder PDF Format sein.
      </p>
      <FileInputForm.Component
        state={state.copyOfJuleica}
        setState={useUpdateStateCallback(setState, 'copyOfJuleica')}
      />
    </>
  ),
}

export default JuleicaEntitlementForm
