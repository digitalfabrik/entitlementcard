import { BlueCardJuleicaEntitlementInput } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import DateForm, { DateFormState } from '../primitive-inputs/DateForm'
import ShortTextForm, { ShortTextFormState } from '../primitive-inputs/ShortTextForm'
import FileInputForm, { FILE_SIZE_LIMIT_MEGA_BYTES, FileInputFormState } from '../primitive-inputs/FileInputForm'
import CustomDivider from '../CustomDivider'

export type JuleicaEntitlementFormState = {
  juleicaNumber: ShortTextFormState
  juleicaExpirationDate: DateFormState
  copyOfJuleica: FileInputFormState
}
type ValidatedInput = BlueCardJuleicaEntitlementInput
type Options = {}
type AdditionalProps = {}
const JuleicaEntitlementForm: Form<JuleicaEntitlementFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: {
    juleicaNumber: ShortTextForm.initialState,
    juleicaExpirationDate: DateForm.initialState,
    copyOfJuleica: FileInputForm.initialState,
  },
  getArrayBufferKeys: state => [
    ...ShortTextForm.getArrayBufferKeys(state.juleicaNumber),
    ...DateForm.getArrayBufferKeys(state.juleicaExpirationDate),
    ...FileInputForm.getArrayBufferKeys(state.copyOfJuleica),
  ],
  getValidatedInput: state => {
    const juleicaNumber = ShortTextForm.getValidatedInput(state.juleicaNumber)
    const juleicaExpirationDate = DateForm.getValidatedInput(state.juleicaExpirationDate)
    const copyOfJuleica = FileInputForm.getValidatedInput(state.copyOfJuleica)
    if (juleicaNumber.type === 'error' || juleicaExpirationDate.type === 'error' || copyOfJuleica.type === 'error')
      return { type: 'error' }
    return {
      type: 'valid',
      value: {
        juleicaNumber: juleicaNumber.value,
        juleicaExpirationDate: juleicaExpirationDate.value,
        copyOfJuleica: copyOfJuleica.value,
      },
    }
  },
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
