import React, { ReactElement } from 'react'

import i18next from '../../../i18n'
import { SelfServiceCardGenerationStep } from '../hooks/useCardGeneratorSelfService'

type SelfServiceStepInfo = {
  stepNr: number
  headline: string
  subHeadline: string
  text: ReactElement
}

const selfServiceStepInfo: { [step in Exclude<SelfServiceCardGenerationStep, 'loading'>]: SelfServiceStepInfo } = {
  input: {
    stepNr: 1,
    headline: i18next.t('selfService:welcome'),
    subHeadline: i18next.t('selfService:fewStepsNeeded'),
    text: <span>{i18next.t('selfService:explanation')}</span>,
  },
  information: {
    stepNr: 2,
    headline: i18next.t('selfService:createdPassSuccessfully'),
    subHeadline: i18next.t('selfService:fewMoreStepsNeeded'),
    text: (
      <span>
        <b>{i18next.t('selfService:appAlreadyInstalled')} </b>
        {i18next.t('selfService:appAlreadyInstalledPrompt')}
      </span>
    ),
  },
  activation: {
    stepNr: 3,
    headline: i18next.t('selfService:almostThere'),
    subHeadline: i18next.t('selfService:activateAndDownloadPrompt'),
    text: (
      <span>
        {i18next.t('selfService:lastStepExplanation1')}
        <b>{i18next.t('selfService:lastStepExplanation2')}</b>
        {i18next.t('selfService:lastStepExplanation3')} <b>{i18next.t('selfService:lastStepExplanation4')}</b>.
      </span>
    ),
  },
}

export default selfServiceStepInfo
