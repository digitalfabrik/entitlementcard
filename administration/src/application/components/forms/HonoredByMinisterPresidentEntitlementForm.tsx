import { GoldenCardHonoredByMinisterPresidentEntitlementInput } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import FileInputForm, { FILE_SIZE_LIMIT_MEGA_BYTES, FileInputFormState } from '../primitive-inputs/FileInputForm'
import CustomDivider from '../CustomDivider'

export type HonoredByMinisterPresidentEntitlementFormState = {
  certificate: FileInputFormState
}
type ValidatedInput = GoldenCardHonoredByMinisterPresidentEntitlementInput
type Options = {}
type AdditionalProps = {}
const HonoredByMinisterPresidentEntitlementForm: Form<
  HonoredByMinisterPresidentEntitlementFormState,
  Options,
  ValidatedInput,
  AdditionalProps
> = {
  initialState: {
    certificate: FileInputForm.initialState,
  },
  getArrayBufferKeys: state => [...FileInputForm.getArrayBufferKeys(state.certificate)],
  getValidatedInput: state => {
    const certificate = FileInputForm.getValidatedInput(state.certificate)
    if (certificate.type === 'error') return { type: 'error' }
    return {
      type: 'valid',
      value: {
        certificate: certificate.value,
      },
    }
  },
  Component: ({ state, setState }) => (
    <>
      <CustomDivider label='Angaben zum Ehrenzeichen' />
      <h4>Urkunde</h4>
      <p>
        Hängen Sie hier bitte Ihre eingescannte oder abfotografierte Urkunde an. Die Datei darf maximal{' '}
        {FILE_SIZE_LIMIT_MEGA_BYTES} MB groß sein und muss im JPG, PNG oder PDF Format sein.
      </p>
      <FileInputForm.Component state={state.certificate} setState={useUpdateStateCallback(setState, 'certificate')} />
    </>
  ),
}

export default HonoredByMinisterPresidentEntitlementForm
