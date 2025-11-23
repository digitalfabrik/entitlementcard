import { Link, Typography } from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'

import { ApplicationType, BavariaCardType } from '../../../generated/graphql'
import i18next from '../../../i18n'
import FormAlert from '../../base/FormAlert'
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

const CardTypeForm = createRadioGroupForm<BavariaCardType>()
const cardTypeOptions = {
  labelByValue: {
    [BavariaCardType.Blue]: i18next.t('applicationForms:blueCardType'),
    [BavariaCardType.Golden]: i18next.t('applicationForms:goldenCardType'),
  },
}

const ApplicationTypeForm = createRadioGroupForm<ApplicationType>()
const applicationTypeOptions = {
  labelByValue: {
    [ApplicationType.FirstApplication]: i18next.t('applicationForms:initialApplication'),
    [ApplicationType.RenewalApplication]: i18next.t('applicationForms:renewalApplication'),
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
    if (!partialValidationResult.value.wantsPhysicalCard && !partialValidationResult.value.wantsDigitalCard) {
      return { type: 'error', message: i18next.t('applicationForms:cardTypeNotChosenError') }
    }
    // Application type must not be null if and only if card type is blue
    if (partialValidationResult.value.cardType !== BavariaCardType.Blue) {
      return { type: 'valid', value: { ...partialValidationResult.value, applicationType: null } }
    }
    const applicationTypeResult = ApplicationTypeForm.validate(state.applicationType, applicationTypeOptions)
    if (applicationTypeResult.type === 'error') {
      return { type: 'error' }
    }
    return { type: 'valid', value: { ...partialValidationResult.value, applicationType: applicationTypeResult.value } }
  },
  Component: ({ state, setState }: FormComponentProps<State>) => {
    const { t } = useTranslation('application')
    const updateApplicationType = useUpdateStateCallback(setState, 'applicationType')
    const validationResult = StepCardTypeForm.validate(state)
    const isInvalid = validationResult.type === 'error'

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Typography component='p'>{t('applicationForms:cardTypeExplanation')}</Typography>
        <Typography>
          {t('applicationForms:cardTypeRequirements')}{' '}
          <Link
            href='https://www.ehrenamt.bayern.de/vorteile-wettbewerbe/ehrenamtskarte/index.php#sec3'
            target='_blank'
            rel='noreferrer'>
            {t('applicationForms:cardTypeRequirementsButton')}
          </Link>
          .
        </Typography>
        <SubForms.cardType.Component
          divideItems={false}
          title={t('applicationForms:cardTypeTitle')}
          options={cardTypeOptions}
          state={state.cardType}
          setState={useUpdateStateCallback(setState, 'cardType')}
        />
        {state.cardType.selectedValue === BavariaCardType.Blue ? (
          <>
            <CustomDivider />
            <SubForms.applicationType.Component
              divideItems={false}
              title={t('applicationForms:applicationType')}
              options={applicationTypeOptions}
              state={state.applicationType}
              setState={updateApplicationType}
            />
          </>
        ) : null}
        <CustomDivider />
        <Typography>
          <Trans i18nKey='applicationForms:applicationTypeDescription' />
        </Typography>
        <SubForms.wantsDigitalCard.Component
          state={state.wantsDigitalCard}
          setState={useUpdateStateCallback(setState, 'wantsDigitalCard')}
          label={t('wantsDigitalCard')}
          options={wantsDigitalCardOptions}
        />
        <SubForms.wantsPhysicalCard.Component
          state={state.wantsPhysicalCard}
          setState={useUpdateStateCallback(setState, 'wantsPhysicalCard')}
          label={t('wantsPhysicalCard')}
          options={wantsPhysicalCardOptions}
        />
        {isInvalid && validationResult.message !== undefined && <FormAlert errorMessage={validationResult.message} />}
      </div>
    )
  },
}

export default StepCardTypeForm
