import React from 'react'

import { GoldenCardEntitlementInput, GoldenCardEntitlementType } from '../../../generated/graphql'
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
import HonoredByMinisterPresidentEntitlementForm from './HonoredByMinisterPresidentEntitlementForm'
import MilitaryReserveEntitlementForm from './MilitaryReserveEntitlementForm'
import WorkAtDepartmentEntitlementForm from './WorkAtDepartmentEntitlementForm'
import WorkAtOrganizationsEntitlementForm from './WorkAtOrganizationsEntitlementForm'

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
type Options = Record<string, unknown>
type AdditionalProps = { applicantName: string }
const GoldenCardEntitlementForm: Form<State, ValidatedInput, AdditionalProps, Options> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createSwitchValidate(SubForms, { entitlementType: entitlementTypeOptions }, 'entitlementType', {
    WORK_AT_ORGANIZATIONS: 'workAtOrganizationsEntitlement',
    WORK_AT_DEPARTMENT: 'workAtDepartmentEntitlement',
    MILITARY_RESERVE: 'militaryReserveEntitlement',
    HONORED_BY_MINISTER_PRESIDENT: 'honoredByMinisterPresidentEntitlement',
  }),
  Component: ({ state, setState, applicantName }: FormComponentProps<State, AdditionalProps, Options>) => (
    <>
      <SubForms.entitlementType.Component
        state={state.entitlementType}
        setState={useUpdateStateCallback(setState, 'entitlementType')}
        options={entitlementTypeOptions}
        divideItems
        title='Ich erfülle folgende Voraussetzung für die Beantragung einer goldenen Ehrenamtskarte:'
      />
      <SwitchComponent value={state.entitlementType.selectedValue}>
        {{
          [GoldenCardEntitlementType.WorkAtOrganizations]: (
            <SubForms.workAtOrganizationsEntitlement.Component
              state={state.workAtOrganizationsEntitlement}
              setState={useUpdateStateCallback(setState, 'workAtOrganizationsEntitlement')}
              applicantName={applicantName}
            />
          ),
          [GoldenCardEntitlementType.HonoredByMinisterPresident]: (
            <SubForms.honoredByMinisterPresidentEntitlement.Component
              state={state.honoredByMinisterPresidentEntitlement}
              setState={useUpdateStateCallback(setState, 'honoredByMinisterPresidentEntitlement')}
            />
          ),
          [GoldenCardEntitlementType.WorkAtDepartment]: (
            <SubForms.workAtDepartmentEntitlement.Component
              state={state.workAtDepartmentEntitlement}
              setState={useUpdateStateCallback(setState, 'workAtDepartmentEntitlement')}
              applicantName={applicantName}
            />
          ),
          [GoldenCardEntitlementType.MilitaryReserve]: (
            <SubForms.militaryReserveEntitlement.Component
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
