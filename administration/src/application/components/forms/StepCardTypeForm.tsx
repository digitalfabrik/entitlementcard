import { ApplicationType, BavariaCardType } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import { Typography } from '@mui/material'
import CheckboxForm from '../primitive-inputs/CheckboxForm'
import CustomDivider from '../CustomDivider'
import { createRadioGroupForm } from '../primitive-inputs/RadioGroupForm'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
  createCompoundValidate,
} from '../../compoundFormUtils'

const CardTypeForm = createRadioGroupForm<BavariaCardType>()
const cardTypeOptions = {
  labelByValue: {
    [BavariaCardType.Blue]: 'Blaue Ehrenamtskarte',
    [BavariaCardType.Golden]: 'Goldene Ehrenamtskarte',
  },
}

const ApplicationTypeForm = createRadioGroupForm<ApplicationType>()
const applicationTypeOptions = {
  labelByValue: {
    [ApplicationType.FirstApplication]: 'Erstantrag',
    [ApplicationType.RenewalApplication]: 'Verlängerungsantrag',
  },
}

const wantsDigitalCardOptions = { required: false } as const

const SubForms = {
  cardType: CardTypeForm,
  applicationType: ApplicationTypeForm,
  wantsDigitalCard: CheckboxForm,
}

type State = CompoundState<typeof SubForms>
type ValidatedInput = { cardType: BavariaCardType; applicationType: ApplicationType | null; wantsDigitalCard: boolean }
type Options = {}
type AdditionalProps = {}
const StepCardTypeForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: { ...createCompoundInitialState(SubForms), wantsDigitalCard: { checked: true } },
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: state => {
    const partialValidationResult = createCompoundValidate(
      { cardType: CardTypeForm, wantsDigitalCard: CheckboxForm },
      {
        cardType: cardTypeOptions,
        wantsDigitalCard: wantsDigitalCardOptions,
      }
    )(state)
    if (partialValidationResult.type === 'error') return { type: 'error' }
    // Application type must not be null if and only if card type is blue
    if (partialValidationResult.value.cardType !== BavariaCardType.Blue) {
      return { type: 'valid', value: { ...partialValidationResult.value, applicationType: null } }
    }
    const applicationTypeResult = ApplicationTypeForm.validate(state.applicationType, applicationTypeOptions)
    if (applicationTypeResult.type === 'error') return { type: 'error' }
    return { type: 'valid', value: { ...partialValidationResult.value, applicationType: applicationTypeResult.value } }
  },
  Component: ({ state, setState }) => {
    const updateApplicationType = useUpdateStateCallback(setState, 'applicationType')
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Typography>
          Die Bayerische Ehrenamtskarte gibt es in zwei Varianten: Die blaue Ehrenamtskarte, welche für drei Jahre
          gültig ist, und die goldene Ehrenamtskarte, welche unbegrenzt gültig ist. Für die blaue Ehrenamtskarte ist
          beispielsweise berechtigt, wer sich seit mindestens zwei Jahren mindestens fünf Stunden pro Woche ehrenamtlich
          engagiert. Für die goldene Ehrenamtskarte ist beispielsweise berechtigt, wer sich seit mindestens 25 Jahren
          mindestens fünf Stunden pro Woche ehrenamtlich engagiert.
        </Typography>
        <Typography>
          Die Erfüllung der Voraussetzungen wird im nächsten Schritt des Antrags abgefragt. Weitere Informationen können
          Sie{' '}
          <a
            href='https://www.lbe.bayern.de/engagement-anerkennen/ehrenamtskarte/voraussetzungen/index.php'
            target='_blank'
            rel='noreferrer'>
            hier einsehen
          </a>
          .
        </Typography>
        <SubForms.cardType.Component
          divideItems={false}
          title='Antrag auf:'
          options={cardTypeOptions}
          state={state.cardType}
          setState={useUpdateStateCallback(setState, 'cardType')}
        />
        {state.cardType.selectedValue === BavariaCardType.Blue ? (
          <>
            <CustomDivider />
            <SubForms.applicationType.Component
              divideItems={false}
              title='Art des Antrags:'
              options={applicationTypeOptions}
              state={state.applicationType}
              setState={updateApplicationType}
            />
          </>
        ) : null}
        <CustomDivider />
        <Typography>
          Die Ehrenamtskarte ist als physische Karte und als digitale Version für Ihr Smartphone oder Tablet erhältlich.
          Hier können Sie wählen, ob Sie neben der physischen auch kostenfrei die digitale Ehrenamtskarte beantragen
          möchten.
        </Typography>
        <SubForms.wantsDigitalCard.Component
          state={state.wantsDigitalCard}
          setState={useUpdateStateCallback(setState, 'wantsDigitalCard')}
          label='Ich beantrage neben der physischen auch die digitale Ehrenamtskarte.'
          options={wantsDigitalCardOptions}
        />
      </div>
    )
  },
}

export default StepCardTypeForm
