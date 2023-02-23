import { WorkAtOrganizationInput } from '../../../generated/graphql'
import { useState } from 'react'
import ConfirmDialog from '../ConfirmDialog'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import OrganizationForm from './OrganizationForm'
import DateForm from '../primitive-inputs/DateForm'
import ShortTextForm from '../primitive-inputs/ShortTextForm'
import NumberForm from '../primitive-inputs/NumberForm'
import { FileRequirementsText, OptionalFileInputForm } from '../primitive-inputs/FileInputForm'
import CustomDivider from '../CustomDivider'
import CheckboxForm from '../primitive-inputs/CheckboxForm'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundValidate,
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

const SubForms = {
  organization: OrganizationForm,
  amountOfWork: NumberForm,
  workSinceDate: DateForm,
  payment: CheckboxForm,
  responsibility: ShortTextForm,
  certificate: OptionalFileInputForm,
}

type State = CompoundState<typeof SubForms>
type ValidatedInput = WorkAtOrganizationInput
type Options = {}
type AdditionalProps = { onDelete?: () => void }
const WorkAtOrganizationForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, {
    amountOfWork: amountOfWorkOptions,
    payment: paymentOptions,
    workSinceDate: { maximumDate: null },
  }),
  Component: ({ state, setState, onDelete }) => (
    <>
      <ActivityDivider onDelete={onDelete} />
      <SubForms.organization.Component
        state={state.organization}
        setState={useUpdateStateCallback(setState, 'organization')}
      />
      <h4>Angaben zur Tätigkeit</h4>
      <SubForms.responsibility.Component
        state={state.responsibility}
        setState={useUpdateStateCallback(setState, 'responsibility')}
        label='Ehrenamtliche Tätigkeit'
      />
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div style={{ flex: '2' }}>
          <SubForms.workSinceDate.Component
            label='Tätig seit'
            state={state.workSinceDate}
            setState={useUpdateStateCallback(setState, 'workSinceDate')}
            options={{ maximumDate: null }}
          />
        </div>
        <div style={{ flex: '3' }}>
          <SubForms.amountOfWork.Component
            label='Arbeitsstunden pro Woche (Durchschnitt)'
            state={state.amountOfWork}
            setState={useUpdateStateCallback(setState, 'amountOfWork')}
            options={amountOfWorkOptions}
            minWidth={250}
          />
        </div>
      </div>
      <SubForms.payment.Component
        state={state.payment}
        setState={useUpdateStateCallback(setState, 'payment')}
        label='Für diese ehrenamtliche Tätigkeit wurde eine Aufwandsentschädigung gewährt.'
        options={paymentOptions}
      />
      <h4>Tätigkeitsnachweis</h4>
      <p>
        Falls vorhanden, hängen Sie hier bitte einen eingescannten oder abfotografierten Tätigkeitsnachweis an.{' '}
        {FileRequirementsText}
      </p>
      <SubForms.certificate.Component
        state={state.certificate}
        setState={useUpdateStateCallback(setState, 'certificate')}
      />
    </>
  ),
}

export default WorkAtOrganizationForm
