import { useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { Card, initializeCardFromCSV } from '../../../cards/Card'
import { generatePdf } from '../../../cards/PdfFactory'
import { CreateCardsResult, createSelfServiceCard } from '../../../cards/createCards'
import { useCreateCardsFromSelfServiceMutation } from '../../../generated/graphql'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import { getCsvHeaders } from '../../../project-configs/helper'
import downloadDataUri from '../../../util/downloadDataUri'
import { useAppToaster } from '../../AppToaster'
import { showCardGenerationError } from '../../util/cardGenerationError'

export enum CardSelfServiceStep {
  form,
  loading,
  information,
  activation,
}

type UseCardGeneratorSelfServiceReturn = {
  selfServiceState: CardSelfServiceStep
  setSelfServiceState: (step: CardSelfServiceStep) => void
  code: CreateCardsResult | null
  selfServiceCard: Card
  setSelfServiceCard: (card: Card) => void
  generateCards: () => Promise<void>
  downloadPdf: (code: CreateCardsResult, fileName: string) => Promise<void>
}

const useCardGeneratorSelfService = (): UseCardGeneratorSelfServiceReturn => {
  const projectConfig = useContext(ProjectConfigContext)
  const appToaster = useAppToaster()
  const { t } = useTranslation('errors')
  const [searchParams] = useSearchParams()
  const [selfServiceState, setSelfServiceState] = useState(CardSelfServiceStep.form)
  const [code, setCode] = useState<CreateCardsResult | null>(null)
  const [createCardsSelfService] = useCreateCardsFromSelfServiceMutation()
  const [selfServiceCard, setSelfServiceCard] = useState(() => {
    const headers = getCsvHeaders(projectConfig)
    const values = headers.map(header => searchParams.get(header))
    return initializeCardFromCSV(projectConfig.card, values, headers, undefined, true)
  })

  const generateCards = useCallback(async (): Promise<void> => {
    setSelfServiceState(CardSelfServiceStep.loading)
    try {
      const code = await createSelfServiceCard(createCardsSelfService, projectConfig, selfServiceCard, t)
      setCode(code)
      setSelfServiceState(CardSelfServiceStep.information)
    } catch (error) {
      if (appToaster) {
        showCardGenerationError(appToaster, error, t)
      }
      setSelfServiceState(CardSelfServiceStep.form)
    }
  }, [projectConfig, setCode, createCardsSelfService, appToaster, selfServiceCard, t])

  const downloadPdf = async (code: CreateCardsResult, fileName: string): Promise<void> => {
    const blob = await generatePdf([code], [selfServiceCard], projectConfig)
    downloadDataUri(blob, fileName)
  }

  return {
    selfServiceState,
    setSelfServiceState,
    code,
    selfServiceCard,
    setSelfServiceCard,
    generateCards,
    downloadPdf,
  }
}
export default useCardGeneratorSelfService
