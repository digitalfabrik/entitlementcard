import { ApplicationType, CardType } from '../../../generated/graphql'
import { SetState, useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import { FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material'
import { FormControl } from '@mui/material'
import CheckboxForm, { CheckboxFormState } from '../primitive-inputs/CheckboxForm'
import CustomDivider from "../CustomDivider";

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

const wantsDigitalCardOptions = { required: false } as const

export type StepCardTypeFormState = {
  cardType: CardType | null
  applicationType: ApplicationType | null
  wantsDigitalCard: CheckboxFormState
}
type ValidatedInput = { cardType: CardType; applicationType: ApplicationType; wantsDigitalCard: boolean }
type Options = {}
type AdditionalProps = {}
const StepCardTypeForm: Form<StepCardTypeFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: { cardType: null, applicationType: null, wantsDigitalCard: CheckboxForm.initialState },
  getArrayBufferKeys: state => [...CheckboxForm.getArrayBufferKeys(state.wantsDigitalCard)],
  getValidatedInput: state => {
    const wantsDigitalCard = CheckboxForm.getValidatedInput(state.wantsDigitalCard, wantsDigitalCardOptions)
    if (state.cardType === null || state.applicationType === null || wantsDigitalCard.type === 'error') {
      return { type: 'error' }
    }
    return {
      type: 'valid',
      value: {
        cardType: state.cardType,
        applicationType: state.applicationType,
        wantsDigitalCard: wantsDigitalCard.value,
      },
    }
  },
  Component: ({ state, setState }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <CardTypeInput state={state.cardType} setState={useUpdateStateCallback(setState, 'cardType')} />
        <CustomDivider />
      <ApplicationTypeInput
        state={state.applicationType}
        setState={useUpdateStateCallback(setState, 'applicationType')}
      />
        <CustomDivider />
      <Typography>
        Die Ehrenamtskarte ist als physische Karte und als digitale Version für Ihr Smartphone oder Tablet erhältlich.
        Hier können Sie wählen, ob Sie neben der physischen auch die digitale Ehrenamtskarte beantragen möchten.
      </Typography>
      <CheckboxForm.Component
        state={state.wantsDigitalCard}
        setState={useUpdateStateCallback(setState, 'wantsDigitalCard')}
        label='Ich beantrage neben der physischen auch die digitale Ehrenamtskarte.'
        options={wantsDigitalCardOptions}
      />
    </div>
  ),
}

export default StepCardTypeForm
