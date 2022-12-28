import { WorkAtOrganizationInput } from '../../../generated/graphql'
import { useState } from 'react'
import ConfirmDialog from '../ConfirmDialog'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import OrganizationForm from './OrganizationForm'
import DateForm from '../primitive-inputs/DateForm'
import ShortTextForm from '../primitive-inputs/ShortTextForm'
import NumberForm from '../primitive-inputs/NumberForm'
import FileInputForm, { FILE_SIZE_LIMIT_MEGA_BYTES } from '../primitive-inputs/FileInputForm'
import CustomDivider from '../CustomDivider'
import CheckboxForm from '../primitive-inputs/CheckboxForm'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundGetValidatedInput,
  createCompoundInitialState,
} from '../../compoundFormUtils'

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

const FormCompounds = {
  organization: OrganizationForm,
  amountOfWork: NumberForm,
  workSinceDate: DateForm,
  payment: CheckboxForm,
  responsibility: ShortTextForm,
  certificate: FileInputForm,
}

export type WorkAtOrganizationFormState = CompoundState<typeof FormCompounds>
type ValidatedInput = WorkAtOrganizationInput
type Options = {}
type AdditionalProps = { onDelete?: () => void }
const WorkAtOrganizationForm: Form<WorkAtOrganizationFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: createCompoundInitialState(FormCompounds),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(FormCompounds),
  getValidatedInput: createCompoundGetValidatedInput(FormCompounds, {
    amountOfWork: amountOfWorkOptions,
    payment: paymentOptions,
  }),
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
            state={state.workSinceDate}
            setState={useUpdateStateCallback(setState, 'workSinceDate')}
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
