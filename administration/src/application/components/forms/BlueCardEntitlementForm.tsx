import { BlueCardEntitlementInput, BlueCardEntitlementType } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import SwitchComponent from '../SwitchComponent'
import WorkAtOrganizationsEntitlementForm, {
  WorkAtOrganizationsEntitlementFormState,
} from './WorkAtOrganizationsEntitlementForm'
import RadioGroupForm from '../primitive-inputs/RadioGroupForm'
import radioGroupForm, { RadioGroupFormState } from '../primitive-inputs/RadioGroupForm'
import JuleicaEntitlementForm, { JuleicaEntitlementFormState } from './JuleicaEntitlementForm'
import WorkAtDepartmentEntitlementForm, {
  WorkAtDepartmentEntitlementFormState,
} from './WorkAtDepartmentEntitlementForm'
import MilitaryReserveEntitlementForm, { MilitaryReserveEntitlementFormState } from './MilitaryReserveEntitlementForm'
import VolunteerServiceEntitlementForm, {
  VolunteerServiceEntitlementFormState,
} from './VolunteerServiceEntitlementForm'

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

export type BlueCardEntitlementFormState = {
  entitlementType: RadioGroupFormState
  workAtOrganizationsEntitlement: WorkAtOrganizationsEntitlementFormState
  juleicaEntitlement: JuleicaEntitlementFormState
  workAtDepartmentEntitlement: WorkAtDepartmentEntitlementFormState
  militaryReserveEntitlement: MilitaryReserveEntitlementFormState
  volunteerServiceEntitlement: VolunteerServiceEntitlementFormState
}
type ValidatedInput = BlueCardEntitlementInput
type Options = {}
type AdditionalProps = {}
const BlueCardEntitlementForm: Form<BlueCardEntitlementFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: {
    entitlementType: RadioGroupForm.initialState,
    workAtOrganizationsEntitlement: WorkAtOrganizationsEntitlementForm.initialState,
    juleicaEntitlement: JuleicaEntitlementForm.initialState,
    workAtDepartmentEntitlement: WorkAtDepartmentEntitlementForm.initialState,
    militaryReserveEntitlement: MilitaryReserveEntitlementForm.initialState,
    volunteerServiceEntitlement: VolunteerServiceEntitlementForm.initialState,
  },
  getArrayBufferKeys: state => [
    ...RadioGroupForm.getArrayBufferKeys(state.entitlementType),
    ...WorkAtOrganizationsEntitlementForm.getArrayBufferKeys(state.workAtOrganizationsEntitlement),
    ...JuleicaEntitlementForm.getArrayBufferKeys(state.juleicaEntitlement),
    ...WorkAtDepartmentEntitlementForm.getArrayBufferKeys(state.workAtDepartmentEntitlement),
    ...MilitaryReserveEntitlementForm.getArrayBufferKeys(state.militaryReserveEntitlement),
    ...VolunteerServiceEntitlementForm.getArrayBufferKeys(state.volunteerServiceEntitlement),
  ],
  getValidatedInput: state => {
    const entitlementTypeResult = radioGroupForm.getValidatedInput(state.entitlementType, entitlementTypeOptions)
    if (entitlementTypeResult.type === 'error') return { type: 'error' }
    const entitlementType = entitlementTypeResult.value.value as BlueCardEntitlementType
    switch (entitlementType) {
      case BlueCardEntitlementType.WorkAtOrganizations: {
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
      case BlueCardEntitlementType.Juleica: {
        const juleicaEntitlement = JuleicaEntitlementForm.getValidatedInput(state.juleicaEntitlement)
        if (juleicaEntitlement.type === 'error') return { type: 'error' }
        return {
          type: 'valid',
          value: {
            entitlementType,
            juleicaEntitlement: juleicaEntitlement.value,
          },
        }
      }
      case BlueCardEntitlementType.WorkAtDepartment:
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
      case BlueCardEntitlementType.MilitaryReserve:
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
      case BlueCardEntitlementType.VolunteerService:
        const volunteerServiceEntitlement = VolunteerServiceEntitlementForm.getValidatedInput(
          state.volunteerServiceEntitlement
        )
        if (volunteerServiceEntitlement.type === 'error') return { type: 'error' }
        return {
          type: 'valid',
          value: {
            entitlementType,
            volunteerServiceEntitlement: volunteerServiceEntitlement.value,
          },
        }
    }
  },
  Component: ({ state, setState }) => (
    <>
      <RadioGroupForm.Component
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
