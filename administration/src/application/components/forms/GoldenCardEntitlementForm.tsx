import { GoldenCardEntitlementInput, GoldenCardEntitlementType } from '../../../generated/graphql'
import { SetState, useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import { Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { memo } from 'react'
import SwitchComponent from '../SwitchComponent'
import WorkAtOrganizationsEntitlementForm, {
  WorkAtOrganizationsEntitlementFormState,
} from './WorkAtOrganizationsEntitlementForm'

const GoldenCardEntitlementTypeForm = memo(
  ({
    state,
    setState,
  }: {
    state: GoldenCardEntitlementType | null
    setState: SetState<GoldenCardEntitlementType | null>
  }) => {
    return (
      <FormControl>
        <FormLabel>
          Ich erfülle folgende Voraussetzung für die Beantragung einer goldenen Ehrenamtskarte:
        </FormLabel>
        <RadioGroup
          sx={{ '& > label': { marginTop: '4px', marginBottom: '4px' } }}
          value={state}
          onChange={e => setState(() => e.target.value as GoldenCardEntitlementType)}>
          <FormControlLabel
            value={GoldenCardEntitlementType.WorkAtOrganizations}
            label='Ich bin seit seit mindestens 25 Jahren mindestens 5 Stunden pro Woche oder 250 Stunden pro Jahr bei einem Verein oder einer Organisation ehrenamtlich tätig.'
            control={<Radio required />}
          />
          <Divider variant='middle' />
          <FormControlLabel
            value={GoldenCardEntitlementType.HonoredByMinisterPresident}
            label='Ich bin Inhaber:in des Ehrenzeichens für Verdienstete im Ehrenamt des Bayerischen Ministerpräsidenten.'
            control={<Radio required />}
          />
          <Divider variant='middle' />
          <FormControlLabel
            value={GoldenCardEntitlementType.ServiceAward}
            label='Ich bin Feuerwehrdienstleistende:r oder Einsatzkraft im Rettungsdienst oder in Einheiten des Katastrophenschutzes und habe eine Dienstzeitauszeichnung nach dem Feuerwehr- und Hilfsorganisationen-Ehrenzeichengesetz (FwHOEzG) erhalten.'
            control={<Radio required />}
          />
          <Divider variant='middle' />
          <FormControlLabel
            value={GoldenCardEntitlementType.ServiceAward}
            label='Ich leiste als Reservist:in seit mindestens 25 Jahren regelmäßig aktiven Wehrdienst in der Bundeswehr, indem ich in dieser Zeit entweder insgesamt mindestens 500 Tage Reservisten-Dienstleistung erbracht habe oder in dieser Zeit ständige:r Angehörige:r eines Bezirks- oder Kreisverbindungskommandos war.'
            control={<Radio required />}
          />
        </RadioGroup>
      </FormControl>
    )
  }
)

export type GoldenCardEntitlementFormState = {
  entitlementType: GoldenCardEntitlementType | null
  workAtOrganizationsEntitlement: WorkAtOrganizationsEntitlementFormState
}
type ValidatedInput = GoldenCardEntitlementInput
type Options = {}
type AdditionalProps = {}
const GoldenCardEntitlementForm: Form<GoldenCardEntitlementFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: {
    entitlementType: null,
    workAtOrganizationsEntitlement: WorkAtOrganizationsEntitlementForm.initialState,
  },
  getArrayBufferKeys: state => [
    ...WorkAtOrganizationsEntitlementForm.getArrayBufferKeys(state.workAtOrganizationsEntitlement),
  ],
  getValidatedInput: state => {
    switch (state.entitlementType) {
      case GoldenCardEntitlementType.WorkAtOrganizations: {
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
  Component: memo(({ state, setState }) => (
    <>
      <GoldenCardEntitlementTypeForm
        state={state.entitlementType}
        setState={useUpdateStateCallback(setState, 'entitlementType')}
      />
      <SwitchComponent value={state.entitlementType}>
        {{
          [GoldenCardEntitlementType.WorkAtOrganizations]: (
            <WorkAtOrganizationsEntitlementForm.Component
              state={state.workAtOrganizationsEntitlement}
              setState={useUpdateStateCallback(setState, 'workAtOrganizationsEntitlement')}
            />
          ),
          [GoldenCardEntitlementType.ServiceAward]: null,
          [GoldenCardEntitlementType.HonoredByMinisterPresident]: null,
        }}
      </SwitchComponent>
    </>
  )),
}

export default GoldenCardEntitlementForm
