import { Card, CardContent, Checkbox, FormControlLabel, FormGroup, IconButton, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { AmountOfWorkUnit, WorkAtOrganizationInput } from '../../../generated/graphql'
import { useState } from 'react'
import ConfirmDialog from '../ConfirmDialog'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import OrganizationForm, { OrganizationFormState } from './OrganizationForm'
import DateForm, { DateFormState } from '../primitive-inputs/DateForm'
import ShortTextForm, { ShortTextFormState } from '../primitive-inputs/ShortTextForm'
import NumberForm, { NumberFormState } from '../primitive-inputs/NumberForm'
import FileInputForm, {FILE_SIZE_LIMIT_MEGA_BYTES, FileInputFormState} from '../primitive-inputs/FileInputForm'

const DeleteActivityButton = ({ onDelete }: { onDelete?: () => void }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  return onDelete === undefined ? null : (
    <>
      <Tooltip title='Aktivität löschen'>
        <IconButton
          onClick={() => setDeleteDialogOpen(true)}
          style={{ position: 'absolute', top: '0', right: '0' }}
          aria-label='Aktivität löschen'>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <ConfirmDialog
        open={deleteDialogOpen}
        onUpdateOpen={setDeleteDialogOpen}
        confirmButtonText='Löschen'
        content='Wollen Sie die Aktivität unwiderruflich löschen?'
        onConfirm={onDelete}
        title={'Aktivität löschen?'}
      />
    </>
  )
}

const amountOfWorkOptions = { min: 0, max: 100 }

export type WorkAtOrganizationFormState = {
  organization: OrganizationFormState
  amountOfWork: NumberFormState
  activeSince: DateFormState
  payment: boolean
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
    payment: false,
    responsibility: ShortTextForm.initialState,
    certificate: FileInputForm.initialState,
  },
  getArrayBufferKeys: state => [
    ...OrganizationForm.getArrayBufferKeys(state.organization),
    ...NumberForm.getArrayBufferKeys(state.amountOfWork),
    ...DateForm.getArrayBufferKeys(state.activeSince),
    ...ShortTextForm.getArrayBufferKeys(state.responsibility),
    ...FileInputForm.getArrayBufferKeys(state.certificate),
  ],
  getValidatedInput: state => {
    const organization = OrganizationForm.getValidatedInput(state.organization)
    const amountOfWork = NumberForm.getValidatedInput(state.amountOfWork, amountOfWorkOptions)
    const activeSince = DateForm.getValidatedInput(state.activeSince)
    const responsibility = ShortTextForm.getValidatedInput(state.responsibility)
    const certificate = FileInputForm.getValidatedInput(state.certificate)
    if (
      organization.type === 'error' ||
      amountOfWork.type === 'error' ||
      activeSince.type === 'error' ||
      responsibility.type === 'error' ||
      certificate.type === 'error'
    )
      return { type: 'error' }
    return {
      type: 'valid',
      value: {
        organization: organization.value,
        amountOfWork: amountOfWork.value,
        amountOfWorkUnit: AmountOfWorkUnit.HoursPerWeek,
        workSinceDate: activeSince.value,
        responsibility: responsibility.value,
        certificate: certificate.value,
        payment: state.payment,
      },
    }
  },
  Component: ({ state, setState, onDelete }) => (
    <Card elevation={4} style={{ margin: '16px 0' }}>
      <CardContent style={{ position: 'relative' }}>
        <DeleteActivityButton onDelete={onDelete} />
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
        <FormGroup>
          <FormControlLabel
            style={{ margin: '8px 0' }}
            control={
              <Checkbox
                checked={state.payment}
                onChange={e => setState(state => ({ ...state, payment: e.target.checked }))}
              />
            }
            label='Für diese ehrenamtliche Tätigkeit wurde eine Aufwandsentschädigung gewährt.'
          />
        </FormGroup>
        <h4>Tätigkeitsnachweis</h4>
        <p>
          Hängen Sie hier bitte einen eingescannten oder abfotografierten Tätigkeitsnachweis an. Dieser darf maximal{' '}
          {FILE_SIZE_LIMIT_MEGA_BYTES} MB groß sein. Wählen Sie eine Datei im JPG, PNG oder PDF Format.
        </p>
        <FileInputForm.Component state={state.certificate} setState={useUpdateStateCallback(setState, 'certificate')} />
      </CardContent>
    </Card>
  ),
}

export default WorkAtOrganizationForm
