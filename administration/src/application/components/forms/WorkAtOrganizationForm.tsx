import { WorkAtOrganizationInput } from '../../../generated/graphql'
import { useState } from 'react'
import ConfirmDialog from '../ConfirmDialog'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import OrganizationForm, { OrganizationFormState } from './OrganizationForm'
import DateForm, { DateFormState } from '../primitive-inputs/DateForm'
import ShortTextForm, { ShortTextFormState } from '../primitive-inputs/ShortTextForm'
import NumberForm, { NumberFormState } from '../primitive-inputs/NumberForm'
import FileInputForm, { FILE_SIZE_LIMIT_MEGA_BYTES, FileInputFormState } from '../primitive-inputs/FileInputForm'
import CustomDivider from '../CustomDivider'
import CheckboxForm, { CheckboxFormState } from '../primitive-inputs/CheckboxForm'

const ActivityDivider = ({ onDelete }: { onDelete?: () => void }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  return (
    <>
      <CustomDivider
        label='Ehrenamtliche Tätigkeit'
        onDelete={onDelete === undefined ? undefined : () => setDeleteDialogOpen(true)}
      />
      {onDelete === undefined ? null : (
        <ConfirmDialog
          open={deleteDialogOpen}
          onUpdateOpen={setDeleteDialogOpen}
          confirmButtonText='Löschen'
          content='Wollen Sie die Tätigkeit unwiderruflich löschen?'
          onConfirm={onDelete}
          title={'Tätigkeit löschen?'}
        />
      )}
    </>
  )
}

const amountOfWorkOptions = { min: 0, max: 100 }
const paymentOptions = { required: false } as const

export type WorkAtOrganizationFormState = {
  organization: OrganizationFormState
  amountOfWork: NumberFormState
  activeSince: DateFormState
  payment: CheckboxFormState
  responsibility: ShortTextFormState
  certificate: FileInputFormState
}
type ValidatedInput = WorkAtOrganizationInput
type Options = {}
type AdditionalProps = { onDelete?: () => void }
const WorkAtOrganizationForm: Form<WorkAtOrganizationFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: {
    organization: OrganizationForm.initialState,
    amountOfWork: NumberForm.initialState,
    activeSince: DateForm.initialState,
    payment: CheckboxForm.initialState,
    responsibility: ShortTextForm.initialState,
    certificate: FileInputForm.initialState,
  },
  getArrayBufferKeys: state => [
    ...OrganizationForm.getArrayBufferKeys(state.organization),
    ...NumberForm.getArrayBufferKeys(state.amountOfWork),
    ...DateForm.getArrayBufferKeys(state.activeSince),
    ...CheckboxForm.getArrayBufferKeys(state.payment),
    ...ShortTextForm.getArrayBufferKeys(state.responsibility),
    ...FileInputForm.getArrayBufferKeys(state.certificate),
  ],
  getValidatedInput: state => {
    const organization = OrganizationForm.getValidatedInput(state.organization)
    const amountOfWork = NumberForm.getValidatedInput(state.amountOfWork, amountOfWorkOptions)
    const activeSince = DateForm.getValidatedInput(state.activeSince)
    const responsibility = ShortTextForm.getValidatedInput(state.responsibility)
    const payment = CheckboxForm.getValidatedInput(state.payment, paymentOptions)
    const certificate = FileInputForm.getValidatedInput(state.certificate)
    if (
      organization.type === 'error' ||
      amountOfWork.type === 'error' ||
      activeSince.type === 'error' ||
      responsibility.type === 'error' ||
      certificate.type === 'error' ||
      payment.type === 'error'
    )
      return { type: 'error' }
    return {
      type: 'valid',
      value: {
        organization: organization.value,
        amountOfWork: amountOfWork.value,
        workSinceDate: activeSince.value,
        responsibility: responsibility.value,
        certificate: certificate.value,
        payment: payment.value,
      },
    }
  },
  Component: ({ state, setState, onDelete }) => (
    <>
      <ActivityDivider onDelete={onDelete} />
      <OrganizationForm.Component
        state={state.organization}
        setState={useUpdateStateCallback(setState, 'organization')}
      />
      <h4>Angaben zur Tätigkeit</h4>
      <ShortTextForm.Component
        state={state.responsibility}
        setState={useUpdateStateCallback(setState, 'responsibility')}
        label='Ehrenamtliche Tätigkeit'
      />
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div style={{ flex: '2' }}>
          <DateForm.Component
            label='Tätig seit'
            state={state.activeSince}
            setState={useUpdateStateCallback(setState, 'activeSince')}
          />
        </div>
        <div style={{ flex: '3' }}>
          <NumberForm.Component
            label='Arbeitsstunden pro Woche (Durchschnitt)'
            state={state.amountOfWork}
            setState={useUpdateStateCallback(setState, 'amountOfWork')}
            options={amountOfWorkOptions}
            minWidth={250}
          />
        </div>
      </div>
      <CheckboxForm.Component
        state={state.payment}
        setState={useUpdateStateCallback(setState, 'payment')}
        label='Für diese ehrenamtliche Tätigkeit wurde eine Aufwandsentschädigung gewährt.'
        options={paymentOptions}
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

export default WorkAtOrganizationForm
