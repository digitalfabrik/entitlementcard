import { BlueCardEntitlementInput, BlueCardEntitlementType } from '../../../generated/graphql'
import { SetState, useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import { Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import SwitchComponent from '../SwitchComponent'
import WorkAtOrganizationsEntitlementForm, {
  WorkAtOrganizationsEntitlementFormState,
} from './WorkAtOrganizationsEntitlementForm'

const BlueCardEntitlementTypeForm = ({
  state,
  setState,
}: {
  state: BlueCardEntitlementType | null
  setState: SetState<BlueCardEntitlementType | null>
}) => {
  return (
    <FormControl>
      <FormLabel>Ich erfülle folgende Voraussetzung für die Beantragung einer blauen Ehrenamtskarte:</FormLabel>
      <RadioGroup
        sx={{ '& > label': { marginTop: '4px', marginBottom: '4px' } }}
        value={state}
        onChange={e => setState(() => e.target.value as BlueCardEntitlementType)}>
        <FormControlLabel
          value={BlueCardEntitlementType.WorkAtOrganizations}
          label='Ich engagiere mich ehrenamtlich seit mindestens zwei Jahren freiwillig mindestens fünf Stunden pro Woche oder bei Projektarbeiten mindestens 250 Stunden jährlich.'
          control={<Radio required />}
        />
        <Divider variant='middle' />
        <FormControlLabel
          value={BlueCardEntitlementType.Juleica}
          label='Ich bin Inhaber:in einer JuLeiCa (Jugendleiter:in-Card).'
          control={<Radio required />}
        />
        <Divider variant='middle' />
        <FormControlLabel
          value={BlueCardEntitlementType.Service}
          label='Ich bin aktiv in der Freiwilligen Feuerwehr mit abgeschlossener Truppmannausbildung bzw. abgeschlossenem Basis-Modul der Modularen Truppausbildung (MTA), oder im Katastrophenschutz oder im Rettungsdienst mit abgeschlossener Grundausbildung.'
          control={<Radio required />}
        />
        <Divider variant='middle' />
        <FormControlLabel
          value={BlueCardEntitlementType.Service}
          label='Ich habe in den vergangenen zwei Kalenderjahren als Reservist regelmäßig aktiven Wehrdienst in der Bundeswehr geleistet, indem ich insgesamt mindestens 40 Tage Reservisten-Dienstleistung erbracht habe oder ständige:r Angehörige:r eines Bezirks- oder Kreisverbindungskommandos war.'
          control={<Radio required />}
        />
        <Divider variant='middle' />
        <FormControlLabel
          value={BlueCardEntitlementType.Service}
          label='Ich leiste einen Freiwilligendienst ab in einem Freiwilligen Sozialen Jahr (FSJ), einem Freiwilligen Ökologischen Jahr (FÖJ) oder einem Bundesfreiwilligendienst (BFD).'
          control={<Radio required />}
        />
      </RadioGroup>
    </FormControl>
  )
}

export type BlueCardEntitlementFormState = {
  entitlementType: BlueCardEntitlementType | null
  workAtOrganizationsEntitlement: WorkAtOrganizationsEntitlementFormState
}
type ValidatedInput = BlueCardEntitlementInput
type Options = {}
type AdditionalProps = {}
const BlueCardEntitlementForm: Form<BlueCardEntitlementFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: {
    entitlementType: null,
    workAtOrganizationsEntitlement: WorkAtOrganizationsEntitlementForm.initialState,
  },
  getArrayBufferKeys: state => [
    ...WorkAtOrganizationsEntitlementForm.getArrayBufferKeys(state.workAtOrganizationsEntitlement),
  ],
  getValidatedInput: state => {
    switch (state.entitlementType) {
      case BlueCardEntitlementType.WorkAtOrganizations: {
        const workAtOrganizationsEntitlement = WorkAtOrganizationsEntitlementForm.getValidatedInput(
          state.workAtOrganizationsEntitlement
        )
        if (workAtOrganizationsEntitlement.type === 'error') return { type: 'error' }
        return {
          type: 'valid',
          value: {
            entitlementType: state.entitlementType,
            workAtOrganizationsEntitlement: workAtOrganizationsEntitlement.value,
          },
        }
      }
      default:
        return { type: 'error' }
    }
  },
  Component: ({ state, setState }) => (
    <>
      <BlueCardEntitlementTypeForm
        state={state.entitlementType}
        setState={useUpdateStateCallback(setState, 'entitlementType')}
      />
      <SwitchComponent value={state.entitlementType}>
        {{
          [BlueCardEntitlementType.WorkAtOrganizations]: (
            <WorkAtOrganizationsEntitlementForm.Component
              state={state.workAtOrganizationsEntitlement}
              setState={useUpdateStateCallback(setState, 'workAtOrganizationsEntitlement')}
            />
          ),
          [BlueCardEntitlementType.Juleica]: null,
          [BlueCardEntitlementType.Service]: null,
        }}
      </SwitchComponent>
    </>
  ),
}

export default BlueCardEntitlementForm
