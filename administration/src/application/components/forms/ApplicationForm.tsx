import { SetState, useUpdateStateCallback } from './useUpdateStateCallback'
import { ApplicationType, BlueCardApplicationInput, BlueCardEntitlementType } from '../../../generated/graphql'
import {
  convertStandardEntitlementFormStateToInput,
  initialStandardEntitlementFormState,
  StandardEntitlementForm,
  StandardEntitlementFormState,
} from './StandardEntitlementForm'
import {
  convertPersonalDataFormStateToInput,
  initialPersonalDataFormState,
  PersonalDataForm,
  PersonalDataFormState,
} from './PersonalDataForm'
import SwitchDisplay from '../SwitchDisplay'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'

const EntitlementTypeInput = ({
  state,
  setState,
}: {
  state: BlueCardEntitlementType | null
  setState: SetState<BlueCardEntitlementType | null>
}) => {
  return (
    <FormControl>
      <FormLabel>In den folgenden Fällen können Sie eine blaue Ehrenamtskarte beantragen:</FormLabel>
      <RadioGroup value={state} onChange={e => setState(() => e.target.value as BlueCardEntitlementType)}>
        <FormControlLabel
          value={BlueCardEntitlementType.Standard}
          label='Ehrenamtliches Engagement seit mindestens 2 Jahren bei einem Verein oder einer Organisation'
          control={<Radio />}
        />
      </RadioGroup>
    </FormControl>
  )
}

export type ApplicationFormState = {
  entitlementType: BlueCardEntitlementType | null
  standardEntitlement: StandardEntitlementFormState
  personalData: PersonalDataFormState
}

export const initialApplicationFormState: ApplicationFormState = {
  entitlementType: null,
  standardEntitlement: initialStandardEntitlementFormState,
  personalData: initialPersonalDataFormState,
}

export const ApplicationForm = ({
  state,
  setState,
}: {
  state: ApplicationFormState
  setState: SetState<ApplicationFormState>
}) => {
  return (
    <>
      <EntitlementTypeInput
        state={state.entitlementType}
        setState={useUpdateStateCallback(setState, 'entitlementType')}
      />
      <SwitchDisplay value={state.entitlementType}>
        {{
          [BlueCardEntitlementType.Standard]: (
            <StandardEntitlementForm
              state={state.standardEntitlement}
              setState={useUpdateStateCallback(setState, 'standardEntitlement')}
            />
          ),
          [BlueCardEntitlementType.Juleica]: null,
          [BlueCardEntitlementType.Service]: null,
        }}
      </SwitchDisplay>
      <PersonalDataForm state={state.personalData} setState={useUpdateStateCallback(setState, 'personalData')} />
    </>
  )
}

export const convertApplicationFormStateToInput = (state: ApplicationFormState): BlueCardApplicationInput => {
  const entitlement = (() => {
    if (state.entitlementType === null) throw Error('EntitlementType is null.')
    switch (state.entitlementType) {
      case BlueCardEntitlementType.Standard:
        const workAtOrganizations = convertStandardEntitlementFormStateToInput(state.standardEntitlement)
        return {
          entitlementType: state.entitlementType,
          workAtOrganizations,
        }
      default:
        throw Error('Not yet implemented.')
    }
  })()

  return {
    entitlement,
    personalData: convertPersonalDataFormStateToInput(state.personalData),
    hasAcceptedPrivacyPolicy: true, // TODO: Add a corresponding field
    applicationType: ApplicationType.FirstApplication, // TODO: Add a corresponding field
    givenInformationIsCorrectAndComplete: true, // TODO: Add a corresponding field
  }
}
