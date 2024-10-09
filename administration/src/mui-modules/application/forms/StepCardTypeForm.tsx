import { Alert, Typography, styled } from '@mui/material'
import React from 'react'

import { ApplicationType, BavariaCardType } from '../../../generated/graphql'
import CustomDivider from '../CustomDivider'
import { useUpdateStateCallback } from '../hooks/useUpdateStateCallback'
import CheckboxForm from '../primitive-inputs/CheckboxForm'
import { createRadioGroupForm } from '../primitive-inputs/RadioGroupForm'
import { Form, FormComponentProps } from '../util/FormType'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
  createCompoundValidate,
} from '../util/compoundFormUtils'

const CardTypeAlert = styled(Alert)`
  margin: 8px 0;
`

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
const wantsPhysicalCardOptions = { required: false } as const

const SubForms = {
  cardType: CardTypeForm,
  applicationType: ApplicationTypeForm,
  wantsPhysicalCard: CheckboxForm,
  wantsDigitalCard: CheckboxForm,
}

type State = CompoundState<typeof SubForms>
type ValidatedInput = {
  cardType: BavariaCardType
  applicationType: ApplicationType | null
  wantsPhysicalCard: boolean
  wantsDigitalCard: boolean
}
const StepCardTypeForm: Form<State, ValidatedInput> = {
  initialState: {
    ...createCompoundInitialState(SubForms),
    wantsDigitalCard: { checked: true },
    wantsPhysicalCard: { checked: false },
  },
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: state => {
    const partialValidationResult = createCompoundValidate(
      { cardType: CardTypeForm, wantsPhysicalCard: CheckboxForm, wantsDigitalCard: CheckboxForm },
      {
        cardType: cardTypeOptions,
        wantsPhysicalCard: wantsPhysicalCardOptions,
        wantsDigitalCard: wantsDigitalCardOptions,
      }
    )(state)
    if (partialValidationResult.type === 'error') {
      return { type: 'error' }
    }
    // Application type must not be null if and only if card type is blue
    if (partialValidationResult.value.cardType !== BavariaCardType.Blue) {
      return { type: 'valid', value: { ...partialValidationResult.value, applicationType: null } }
    }
    if (!partialValidationResult.value.wantsPhysicalCard && !partialValidationResult.value.wantsDigitalCard) {
      return { type: 'error', message: 'Es muss mindestens ein Kartentyp ausgewählt sein.' }
    }
    const applicationTypeResult = ApplicationTypeForm.validate(state.applicationType, applicationTypeOptions)
    if (applicationTypeResult.type === 'error') {
      return { type: 'error' }
    }
    return { type: 'valid', value: { ...partialValidationResult.value, applicationType: applicationTypeResult.value } }
  },
  Component: ({ state, setState }: FormComponentProps<State>) => {
    const updateApplicationType = useUpdateStateCallback(setState, 'applicationType')
    const validationResult = StepCardTypeForm.validate(state)
    const isInvalid = validationResult.type === 'error'

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
            href='https://www.ehrenamt.bayern.de/vorteile-wettbewerbe/ehrenamtskarte/index.php#sec3'
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
          Hier können Sie auswählen, welche Kartentypen Sie beantragen möchten.
        </Typography>
        <SubForms.wantsDigitalCard.Component
          state={state.wantsDigitalCard}
          setState={useUpdateStateCallback(setState, 'wantsDigitalCard')}
          label='Ich beantrage eine digitale Ehrenamtskarte.'
          options={wantsDigitalCardOptions}
        />
        <SubForms.wantsPhysicalCard.Component
          state={state.wantsPhysicalCard}
          setState={useUpdateStateCallback(setState, 'wantsPhysicalCard')}
          label='Ich beantrage eine physische Ehrenamtskarte.'
          options={wantsPhysicalCardOptions}
        />
        {isInvalid && validationResult.message !== undefined && (
          <CardTypeAlert severity='error'>{validationResult.message}</CardTypeAlert>
        )}
      </div>
    )
  },
}

export default StepCardTypeForm
