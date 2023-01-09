import { GoldenCardEntitlementInput, GoldenCardEntitlementType } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import SwitchComponent from '../SwitchComponent'
import WorkAtOrganizationsEntitlementForm, {
  WorkAtOrganizationsEntitlementFormState,
} from './WorkAtOrganizationsEntitlementForm'
import RadioGroupForm, { RadioGroupFormState } from '../primitive-inputs/RadioGroupForm'
import radioGroupForm from '../primitive-inputs/RadioGroupForm'
import WorkAtDepartmentEntitlementForm, {
  WorkAtDepartmentEntitlementFormState,
} from './WorkAtDepartmentEntitlementForm'
import MilitaryReserveEntitlementForm, { MilitaryReserveEntitlementFormState } from './MilitaryReserveEntitlementForm'
import HonoredByMinisterPresidentEntitlementForm, {
  HonoredByMinisterPresidentEntitlementFormState,
} from './HonoredByMinisterPresidentEntitlementForm'

const entitlementTypeOptions: { labelByValue: { [K in GoldenCardEntitlementType]: string } } = {
  labelByValue: {
    [GoldenCardEntitlementType.WorkAtOrganizations]:
      'Ich bin seit seit mindestens 25 Jahren mindestens 5 Stunden pro Woche oder 250 Stunden pro Jahr bei einem Verein oder einer Organisation ehrenamtlich tätig.',
    [GoldenCardEntitlementType.HonoredByMinisterPresident]:
      'Ich bin Inhaber:in des Ehrenzeichens für Verdienstete im Ehrenamt des Bayerischen Ministerpräsidenten.',
    [GoldenCardEntitlementType.WorkAtDepartment]:
      'Ich bin Feuerwehrdienstleistende:r oder Einsatzkraft im Rettungsdienst oder in Einheiten des Katastrophenschutzes und habe eine Dienstzeitauszeichnung nach dem Feuerwehr- und Hilfsorganisationen-Ehrenzeichengesetz (FwHOEzG) erhalten.',
    [GoldenCardEntitlementType.MilitaryReserve]:
      'Ich leiste als Reservist:in seit mindestens 25 Jahren regelmäßig aktiven Wehrdienst in der Bundeswehr, indem ich in dieser Zeit entweder insgesamt mindestens 500 Tage Reservisten-Dienstleistung erbracht habe oder in dieser Zeit ständige:r Angehörige:r eines Bezirks- oder Kreisverbindungskommandos war.',
  },
}

export type GoldenCardEntitlementFormState = {
  entitlementType: RadioGroupFormState
  workAtOrganizationsEntitlement: WorkAtOrganizationsEntitlementFormState
  honoredByMinisterPresidentEntitlement: HonoredByMinisterPresidentEntitlementFormState
  workAtDepartmentEntitlement: WorkAtDepartmentEntitlementFormState
  militaryReserveEntitlement: MilitaryReserveEntitlementFormState
}
type ValidatedInput = GoldenCardEntitlementInput
type Options = {}
type AdditionalProps = {}
const GoldenCardEntitlementForm: Form<GoldenCardEntitlementFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: {
    entitlementType: RadioGroupForm.initialState,
    workAtOrganizationsEntitlement: WorkAtOrganizationsEntitlementForm.initialState,
    honoredByMinisterPresidentEntitlement: HonoredByMinisterPresidentEntitlementForm.initialState,
    workAtDepartmentEntitlement: WorkAtDepartmentEntitlementForm.initialState,
    militaryReserveEntitlement: MilitaryReserveEntitlementForm.initialState,
  },
  getArrayBufferKeys: state => [
    ...RadioGroupForm.getArrayBufferKeys(state.entitlementType),
    ...WorkAtOrganizationsEntitlementForm.getArrayBufferKeys(state.workAtOrganizationsEntitlement),
    ...HonoredByMinisterPresidentEntitlementForm.getArrayBufferKeys(state.honoredByMinisterPresidentEntitlement),
    ...WorkAtDepartmentEntitlementForm.getArrayBufferKeys(state.workAtDepartmentEntitlement),
    ...MilitaryReserveEntitlementForm.getArrayBufferKeys(state.militaryReserveEntitlement),
  ],
  getValidatedInput: state => {
    const entitlementTypeResult = radioGroupForm.getValidatedInput(state.entitlementType, entitlementTypeOptions)
    if (entitlementTypeResult.type === 'error') return { type: 'error' }
    const entitlementType = entitlementTypeResult.value.value as GoldenCardEntitlementType
    switch (entitlementType) {
      case GoldenCardEntitlementType.WorkAtOrganizations: {
        const workAtOrganizationsEntitlement = WorkAtOrganizationsEntitlementForm.getValidatedInput(
          state.workAtOrganizationsEntitlement
        )
        if (workAtOrganizationsEntitlement.type === 'error') return { type: 'error' }
        return {
          type: 'valid',
          value: {
            entitlementType,
            workAtOrganizationsEntitlement: workAtOrganizationsEntitlement.value,
          },
        }
      }
      case GoldenCardEntitlementType.HonoredByMinisterPresident:
        const honoredByMinisterPresidentEntitlement = HonoredByMinisterPresidentEntitlementForm.getValidatedInput(
          state.honoredByMinisterPresidentEntitlement
        )
        if (honoredByMinisterPresidentEntitlement.type === 'error') return { type: 'error' }
        return {
          type: 'valid',
          value: {
            entitlementType,
            honoredByMinisterPresidentEntitlement: honoredByMinisterPresidentEntitlement.value,
          },
        }
      case GoldenCardEntitlementType.WorkAtDepartment:
        const workAtDepartmentEntitlement = WorkAtDepartmentEntitlementForm.getValidatedInput(
          state.workAtDepartmentEntitlement
        )
        if (workAtDepartmentEntitlement.type === 'error') return { type: 'error' }
        return {
          type: 'valid',
          value: {
            entitlementType,
            workAtDepartmentEntitlement: workAtDepartmentEntitlement.value,
          },
        }
      case GoldenCardEntitlementType.MilitaryReserve:
        const militaryReserveEntitlement = MilitaryReserveEntitlementForm.getValidatedInput(
          state.militaryReserveEntitlement
        )
        if (militaryReserveEntitlement.type === 'error') return { type: 'error' }
        return {
          type: 'valid',
          value: {
            entitlementType,
            militaryReserveEntitlement: militaryReserveEntitlement.value,
          },
        }
    }
  },
  Component: ({ state, setState }) => (
    <>
      <RadioGroupForm.Component
        state={state.entitlementType}
        setState={useUpdateStateCallback(setState, 'entitlementType')}
        options={entitlementTypeOptions}
        divideItems
        title='Ich erfülle folgende Voraussetzung für die Beantragung einer goldenen Ehrenamtskarte:'
      />
      <SwitchComponent value={state.entitlementType.selectedValue}>
        {{
          [GoldenCardEntitlementType.WorkAtOrganizations]: (
            <WorkAtOrganizationsEntitlementForm.Component
              state={state.workAtOrganizationsEntitlement}
              setState={useUpdateStateCallback(setState, 'workAtOrganizationsEntitlement')}
            />
          ),
          [GoldenCardEntitlementType.HonoredByMinisterPresident]: (
            <HonoredByMinisterPresidentEntitlementForm.Component
              state={state.honoredByMinisterPresidentEntitlement}
              setState={useUpdateStateCallback(setState, 'honoredByMinisterPresidentEntitlement')}
            />
          ),
          [GoldenCardEntitlementType.WorkAtDepartment]: (
            <WorkAtDepartmentEntitlementForm.Component
              state={state.workAtDepartmentEntitlement}
              setState={useUpdateStateCallback(setState, 'workAtDepartmentEntitlement')}
            />
          ),
          [GoldenCardEntitlementType.MilitaryReserve]: (
            <MilitaryReserveEntitlementForm.Component
              state={state.militaryReserveEntitlement}
              setState={useUpdateStateCallback(setState, 'militaryReserveEntitlement')}
            />
          ),
        }}
      </SwitchComponent>
    </>
  ),
}

export default GoldenCardEntitlementForm
