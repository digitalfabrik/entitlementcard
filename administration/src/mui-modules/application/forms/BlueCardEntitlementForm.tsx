import React from 'react'

import { BlueCardEntitlementInput, BlueCardEntitlementType } from '../../../generated/graphql'
import SwitchComponent from '../SwitchComponent'
import { useUpdateStateCallback } from '../hooks/useUpdateStateCallback'
import { createRadioGroupForm } from '../primitive-inputs/RadioGroupForm'
import { Form, FormComponentProps } from '../util/FormType'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
  createSwitchValidate,
} from '../util/compoundFormUtils'
import JuleicaEntitlementForm from './JuleicaEntitlementForm'
import MilitaryReserveEntitlementForm from './MilitaryReserveEntitlementForm'
import VolunteerServiceEntitlementForm from './VolunteerServiceEntitlementForm'
import WorkAtDepartmentEntitlementForm from './WorkAtDepartmentEntitlementForm'
import WorkAtOrganizationsEntitlementForm from './WorkAtOrganizationsEntitlementForm'

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

type State = CompoundState<typeof SubForms>
type ValidatedInput = BlueCardEntitlementInput
type Options = Record<string, unknown>
type AdditionalProps = { applicantName: string }
const BlueCardEntitlementForm: Form<State, ValidatedInput, AdditionalProps, Options> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createSwitchValidate(SubForms, { entitlementType: entitlementTypeOptions }, 'entitlementType', {
    JULEICA: 'juleicaEntitlement',
    MILITARY_RESERVE: 'militaryReserveEntitlement',
    VOLUNTEER_SERVICE: 'volunteerServiceEntitlement',
    WORK_AT_DEPARTMENT: 'workAtDepartmentEntitlement',
    WORK_AT_ORGANIZATIONS: 'workAtOrganizationsEntitlement',
  }),
  Component: ({ state, setState, applicantName }: FormComponentProps<State, AdditionalProps, Options>) => (
    <>
      <SubForms.entitlementType.Component
        state={state.entitlementType}
        divideItems
        title='Ich erfülle folgende Voraussetzung für die Beantragung einer blauen Ehrenamtskarte:'
        options={entitlementTypeOptions}
        setState={useUpdateStateCallback(setState, 'entitlementType')}
      />
      <SwitchComponent value={state.entitlementType.selectedValue}>
        {{
          [BlueCardEntitlementType.WorkAtOrganizations]: (
            <SubForms.workAtOrganizationsEntitlement.Component
              state={state.workAtOrganizationsEntitlement}
              setState={useUpdateStateCallback(setState, 'workAtOrganizationsEntitlement')}
              applicantName={applicantName}
            />
          ),
          [BlueCardEntitlementType.Juleica]: (
            <SubForms.juleicaEntitlement.Component
              state={state.juleicaEntitlement}
              setState={useUpdateStateCallback(setState, 'juleicaEntitlement')}
            />
          ),
          [BlueCardEntitlementType.WorkAtDepartment]: (
            <SubForms.workAtDepartmentEntitlement.Component
              state={state.workAtDepartmentEntitlement}
              setState={useUpdateStateCallback(setState, 'workAtDepartmentEntitlement')}
              applicantName={applicantName}
            />
          ),
          [BlueCardEntitlementType.MilitaryReserve]: (
            <SubForms.militaryReserveEntitlement.Component
              state={state.militaryReserveEntitlement}
              setState={useUpdateStateCallback(setState, 'militaryReserveEntitlement')}
            />
          ),
          [BlueCardEntitlementType.VolunteerService]: (
            <SubForms.volunteerServiceEntitlement.Component
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
