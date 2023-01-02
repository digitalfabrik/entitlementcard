import { BlueCardEntitlementInput, BlueCardEntitlementType } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import SwitchComponent from '../SwitchComponent'
import WorkAtOrganizationsEntitlementForm from './WorkAtOrganizationsEntitlementForm'
import { createRadioGroupForm } from '../primitive-inputs/RadioGroupForm'
import JuleicaEntitlementForm from './JuleicaEntitlementForm'
import WorkAtDepartmentEntitlementForm from './WorkAtDepartmentEntitlementForm'
import MilitaryReserveEntitlementForm from './MilitaryReserveEntitlementForm'
import VolunteerServiceEntitlementForm from './VolunteerServiceEntitlementForm'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
  createSwitchGetValidatedInput,
} from '../../compoundFormUtils'

const EntitlementTypeRadioGroupForm = createRadioGroupForm<BlueCardEntitlementType>()
const entitlementTypeOptions: { labelByValue: { [K in BlueCardEntitlementType]: string } } = {
  labelByValue: {
    [BlueCardEntitlementType.WorkAtOrganizations]:
      'Ich engagiere mich ehrenamtlich seit mindestens zwei Jahren freiwillig mindestens fünf Stunden pro Woche oder bei Projektarbeiten mindestens 250 Stunden jährlich.',
    [BlueCardEntitlementType.Juleica]: 'Ich bin Inhaber:in einer JuLeiCa (Jugendleiter:in-Card).',
    [BlueCardEntitlementType.WorkAtDepartment]:
      'Ich bin aktiv in der Freiwilligen Feuerwehr mit abgeschlossener Truppmannausbildung bzw. abgeschlossenem Basis-Modul der Modularen Truppausbildung (MTA), oder im Katastrophenschutz oder im Rettungsdienst mit abgeschlossener Grundausbildung.',
    [BlueCardEntitlementType.MilitaryReserve]:
      'Ich habe in den vergangenen zwei Kalenderjahren als Reservist regelmäßig aktiven Wehrdienst in der Bundeswehr geleistet, indem ich insgesamt mindestens 40 Tage Reservisten-Dienstleistung erbracht habe oder ständige:r Angehörige:r eines Bezirks- oder Kreisverbindungskommandos war.',
    [BlueCardEntitlementType.VolunteerService]:
      'Ich leiste einen Freiwilligendienst ab in einem Freiwilligen Sozialen Jahr (FSJ), einem Freiwilligen Ökologischen Jahr (FÖJ) oder einem Bundesfreiwilligendienst (BFD).',
  },
}

const SubForms = {
  entitlementType: EntitlementTypeRadioGroupForm,
  workAtOrganizationsEntitlement: WorkAtOrganizationsEntitlementForm,
  juleicaEntitlement: JuleicaEntitlementForm,
  workAtDepartmentEntitlement: WorkAtDepartmentEntitlementForm,
  militaryReserveEntitlement: MilitaryReserveEntitlementForm,
  volunteerServiceEntitlement: VolunteerServiceEntitlementForm,
}

export type BlueCardEntitlementFormState = CompoundState<typeof SubForms>
type ValidatedInput = BlueCardEntitlementInput
type Options = {}
type AdditionalProps = {}
const BlueCardEntitlementForm: Form<BlueCardEntitlementFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  getValidatedInput: createSwitchGetValidatedInput(
    SubForms,
    { entitlementType: entitlementTypeOptions },
    'entitlementType',
    {
      JULEICA: 'juleicaEntitlement',
      MILITARY_RESERVE: 'militaryReserveEntitlement',
      VOLUNTEER_SERVICE: 'volunteerServiceEntitlement',
      WORK_AT_DEPARTMENT: 'workAtDepartmentEntitlement',
      WORK_AT_ORGANIZATIONS: 'workAtOrganizationsEntitlement',
    }
  ),
  Component: ({ state, setState }) => (
    <>
      <EntitlementTypeRadioGroupForm.Component
        state={state.entitlementType}
        divideItems
        title='Ich erfülle folgende Voraussetzung für die Beantragung einer blauen Ehrenamtskarte:'
        options={entitlementTypeOptions}
        setState={useUpdateStateCallback(setState, 'entitlementType')}
      />
      <SwitchComponent value={state.entitlementType.selectedValue}>
        {{
          [BlueCardEntitlementType.WorkAtOrganizations]: (
            <WorkAtOrganizationsEntitlementForm.Component
              state={state.workAtOrganizationsEntitlement}
              setState={useUpdateStateCallback(setState, 'workAtOrganizationsEntitlement')}
            />
          ),
          [BlueCardEntitlementType.Juleica]: (
            <JuleicaEntitlementForm.Component
              state={state.juleicaEntitlement}
              setState={useUpdateStateCallback(setState, 'juleicaEntitlement')}
            />
          ),
          [BlueCardEntitlementType.WorkAtDepartment]: (
            <WorkAtDepartmentEntitlementForm.Component
              state={state.workAtDepartmentEntitlement}
              setState={useUpdateStateCallback(setState, 'workAtDepartmentEntitlement')}
            />
          ),
          [BlueCardEntitlementType.MilitaryReserve]: (
            <MilitaryReserveEntitlementForm.Component
              state={state.militaryReserveEntitlement}
              setState={useUpdateStateCallback(setState, 'militaryReserveEntitlement')}
            />
          ),
          [BlueCardEntitlementType.VolunteerService]: (
            <VolunteerServiceEntitlementForm.Component
              state={state.volunteerServiceEntitlement}
              setState={useUpdateStateCallback(setState, 'volunteerServiceEntitlement')}
            />
          ),
        }}
      </SwitchComponent>
    </>
  ),
}

export default BlueCardEntitlementForm
