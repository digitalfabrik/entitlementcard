import { Card, CardContent, Checkbox, FormControlLabel, FormGroup, IconButton, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { AmountOfWorkUnit, WorkAtOrganizationInput } from '../../../generated/graphql'
import {
  convertOrganizationFormStateToInput,
  initialOrganizationFormState,
  OrganizationForm,
  OrganizationFormState,
} from './OrganizationForm'
import { useState } from 'react'
import ConfirmDialog from '../ConfirmDialog'
import { convertNumberFormStateToInput, initialNumberFormState, NumberForm } from '../primitive-inputs/NumberForm'
import { DateForm, convertDateFormStateToInput, initialDateFormState } from '../primitive-inputs/DateForm'
import {
  convertRequiredStringFormStateToInput,
  initialRequiredStringFormState,
  RequiredStringForm,
} from '../primitive-inputs/RequiredStringForm'
import {
  convertRequiredFileFormStateToInput,
  FILE_SIZE_LIMIT_MEGA_BYTES,
  FileForm,
  FileFormState,
  initialFileFormState,
} from '../primitive-inputs/FileInputForm'

export type WorkAtOrganizationFormState = {
  organizationFormState: OrganizationFormState
  activeSince: string
  amountOfWork: string
  payment: boolean
  responsibility: string
  certificate: FileFormState
}

export const initialWorkAtOrganizationFormState: WorkAtOrganizationFormState = {
  organizationFormState: initialOrganizationFormState,
  amountOfWork: initialNumberFormState,
  activeSince: initialDateFormState,
  payment: false,
  responsibility: initialRequiredStringFormState,
  certificate: initialFileFormState,
}

export const WorkAtOrganizationForm = ({
  state,
  setState,
  onDelete,
}: {
  state: WorkAtOrganizationFormState
  setState: (value: WorkAtOrganizationFormState) => void
  onDelete?: () => void
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  return (
    <Card elevation={4} style={{ margin: '16px 0' }}>
      <CardContent style={{ position: 'relative' }}>
        {onDelete === undefined ? null : (
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
              setOpen={setDeleteDialogOpen}
              confirmButtonText='Löschen'
              content='Wollen Sie die Aktivität unwiderruflich löschen?'
              onConfirm={onDelete}
              title={'Aktivität löschen?'}
            />
          </>
        )}
        <OrganizationForm
          state={state.organizationFormState}
          setState={organizationFormState => setState({ ...state, organizationFormState })}
        />
        <h4>Angaben zur Tätigkeit</h4>
        <RequiredStringForm
          state={state.responsibility}
          setState={responsibility => setState({ ...state, responsibility })}
          label='Ehrenamtliche Tätigkeit'
        />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ flex: '2' }}>
            <DateForm
              label='Tätig seit'
              state={state.activeSince}
              setState={activeSince => setState({ ...state, activeSince })}
            />
          </div>
          <div style={{ flex: '3' }}>
            <NumberForm
              label='Arbeitsstunden pro Woche (Durchschnitt)'
              state={state.amountOfWork}
              setState={amountOfWork => setState({ ...state, amountOfWork })}
              min={0}
              max={100}
            />
          </div>
        </div>
        <FormGroup>
          <FormControlLabel
            style={{ margin: '8px 0' }}
            control={
              <Checkbox checked={state.payment} onChange={() => setState({ ...state, payment: !state.payment })} />
            }
            label='Für diese ehrenamtliche Tätigkeit wurde eine Aufwandsentschädigung gewährt.'
          />
        </FormGroup>
        <h4>Tätigkeitsnachweis</h4>
        <p>
          Hängen Sie hier bitte einen eingescannten oder abfotografierten Tätigkeitsnachweis an. Dieser darf maximal{' '}
          {FILE_SIZE_LIMIT_MEGA_BYTES}MB groß sein. Wählen Sie eine Datei im JPG, PNG oder PDF Format.
        </p>
        <FileForm
          label='Zertifikat'
          state={state.certificate}
          setState={certificate => setState({ ...state, certificate })}
        />
      </CardContent>
    </Card>
  )
}

export const convertWorkAtOrganizationFormStateToInput = (
  state: WorkAtOrganizationFormState
): WorkAtOrganizationInput => {
  return {
    organization: convertOrganizationFormStateToInput(state.organizationFormState),
    workSinceDate: convertDateFormStateToInput(state.activeSince),
    amountOfWork: convertNumberFormStateToInput(state.amountOfWork, 0, 100),
    amountOfWorkUnit: AmountOfWorkUnit.HoursPerWeek,
    certificate: convertRequiredFileFormStateToInput(state.certificate),
    payment: state.payment,
    responsibility: convertRequiredStringFormStateToInput(state.responsibility),
  }
}
