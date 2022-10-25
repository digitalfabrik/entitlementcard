import { SetState, useUpdateStateCallback } from './useUpdateStateCallback'
import { BlueCardEntitlementType } from '../../../generated/graphql'
import {
  initialStandardEntitlementFormState,
  StandardEntitlementForm,
  StandardEntitlementFormState,
} from './StandardEntitlementForm'
import { initialPersonalDataFormState, PersonalDataForm, PersonalDataFormState } from './PersonalDataForm'
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
          [BlueCardEntitlementType.Juleica]: <JuleicaEntitlementForm />,
          [BlueCardEntitlementType.Service]: <ServiceEntitlementForm />,
        }}
      </SwitchDisplay>
      <PersonalDataForm state={state.personalData} setState={useUpdateStateCallback(setState, 'personalData')} />
    </>
  )
}

const JuleicaEntitlementForm = () => null
const ServiceEntitlementForm = () => null
