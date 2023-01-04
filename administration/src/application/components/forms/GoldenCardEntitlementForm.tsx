import { GoldenCardEntitlementInput, GoldenCardEntitlementType } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import SwitchComponent from '../SwitchComponent'
import WorkAtOrganizationsEntitlementForm from './WorkAtOrganizationsEntitlementForm'
import { createRadioGroupForm } from '../primitive-inputs/RadioGroupForm'
import WorkAtDepartmentEntitlementForm from './WorkAtDepartmentEntitlementForm'
import MilitaryReserveEntitlementForm from './MilitaryReserveEntitlementForm'
import HonoredByMinisterPresidentEntitlementForm from './HonoredByMinisterPresidentEntitlementForm'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
  createSwitchValidate,
} from '../../compoundFormUtils'

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

const EntitlementTypeRadioGroupForm = createRadioGroupForm<GoldenCardEntitlementType>()

const SubForms = {
  entitlementType: EntitlementTypeRadioGroupForm,
  workAtOrganizationsEntitlement: WorkAtOrganizationsEntitlementForm,
  honoredByMinisterPresidentEntitlement: HonoredByMinisterPresidentEntitlementForm,
  workAtDepartmentEntitlement: WorkAtDepartmentEntitlementForm,
  militaryReserveEntitlement: MilitaryReserveEntitlementForm,
}

type State = CompoundState<typeof SubForms>
type ValidatedInput = GoldenCardEntitlementInput
type Options = {}
type AdditionalProps = {}
const GoldenCardEntitlementForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createSwitchValidate(
    SubForms,
    { entitlementType: entitlementTypeOptions },
    'entitlementType',
    {
      WORK_AT_ORGANIZATIONS: 'workAtOrganizationsEntitlement',
      WORK_AT_DEPARTMENT: 'workAtDepartmentEntitlement',
      MILITARY_RESERVE: 'militaryReserveEntitlement',
      HONORED_BY_MINISTER_PRESIDENT: 'honoredByMinisterPresidentEntitlement',
    }
  ),
  Component: ({ state, setState }) => (
    <>
      <EntitlementTypeRadioGroupForm.Component
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
