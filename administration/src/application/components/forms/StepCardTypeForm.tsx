import { ApplicationType, CardType } from '../../../generated/graphql'
import { SetState, useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import { FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { FormControl } from '@mui/material'
import { memo } from 'react'

const CardTypeInput = ({ state, setState }: { state: CardType | null; setState: SetState<CardType | null> }) => {
  return (
    <FormControl>
      <FormLabel>Antrag auf:</FormLabel>
      <RadioGroup value={state} onChange={e => setState(() => e.target.value as CardType)}>
        <FormControlLabel value={CardType.Blue} label='Blaue Ehrenamtskarte' control={<Radio required />} />
        <FormControlLabel value={CardType.Golden} label='Goldene Ehrenamtskarte' control={<Radio required />} />
      </RadioGroup>
    </FormControl>
  )
}

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
  cardType: CardType | null
  applicationType: ApplicationType | null
}
type ValidatedInput = { cardType: CardType; applicationType: ApplicationType }
type Options = {}
type AdditionalProps = {}
const StepCardTypeForm: Form<StepCardTypeFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: { cardType: null, applicationType: null },
  getArrayBufferKeys: () => [],
  getValidatedInput: ({ cardType, applicationType }) => {
    if (cardType === null || applicationType === null) {
      return { type: 'error' }
    }
    return { type: 'valid', value: { cardType, applicationType } }
  },
  Component: memo(({ state, setState }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <CardTypeInput state={state.cardType} setState={useUpdateStateCallback(setState, 'cardType')} />
      <ApplicationTypeInput
        state={state.applicationType}
        setState={useUpdateStateCallback(setState, 'applicationType')}
      />
    </div>
  )),
}

export default StepCardTypeForm
