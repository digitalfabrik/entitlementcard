import { ApplicationType } from '../../../generated/graphql'
import { SetState, useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import { FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { FormControl } from '@mui/material'

const ApplicationTypeInput = ({
  state,
  setState,
}: {
  state: ApplicationType | null
  setState: SetState<ApplicationType | null>
}) => {
  return (
    <FormControl>
      <FormLabel>Art des Antrags:</FormLabel>
      <RadioGroup value={state} onChange={e => setState(() => e.target.value as ApplicationType)}>
        <FormControlLabel value={ApplicationType.FirstApplication} label='Erstantrag' control={<Radio required />} />
        <FormControlLabel
          value={ApplicationType.RenewalApplication}
          label='Verlängerungsantrag'
          control={<Radio required />}
        />
      </RadioGroup>
    </FormControl>
  )
}

export type StepCardTypeFormState = {
  cardType: null // TODO: Add possibility to set CardType (blue or golden)
  applicationType: ApplicationType | null
}
type ValidatedInput = { cardType: null; applicationType: ApplicationType }
type Options = {}
type AdditionalProps = {}
const StepCardTypeForm: Form<StepCardTypeFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: { cardType: null, applicationType: null },
  getArrayBufferKeys: () => [],
  getValidatedInput: ({ cardType, applicationType }) => {
    if (applicationType === null) {
      return { type: 'error' }
    }
    return { type: 'valid', value: { cardType, applicationType } }
  },
  Component: ({ state, setState }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <ApplicationTypeInput
        state={state.applicationType}
        setState={useUpdateStateCallback(setState, 'applicationType')}
      />
    </div>
  ),
}

export default StepCardTypeForm
