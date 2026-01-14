import { useSnackbar } from 'notistack'
import { useCallback, useContext, useState } from 'react'
import { useSearchParams } from 'react-router'

import { Card, initializeCardFromCSV } from '../../../cards/card'
import { showCardGenerationError } from '../../../cards/cardGenerationError'
import { CreateCardsResult, createSelfServiceCard } from '../../../cards/createCards'
import { generatePdf } from '../../../cards/pdf/pdfFactory'
import { useCreateCardsFromSelfServiceMutation } from '../../../generated/graphql'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import { getCsvHeaders } from '../../../project-configs/helper'
import downloadDataUri from '../../../util/downloadDataUri'

export type SelfServiceCardGenerationStep = 'input' | 'loading' | 'information' | 'activation'

type UseCardGeneratorSelfServiceReturn = {
  cardGenerationStep: SelfServiceCardGenerationStep
  setCardGenerationStep: (step: SelfServiceCardGenerationStep) => void
  code: CreateCardsResult | null
  selfServiceCard: Card
  setSelfServiceCard: (card: Card) => void
  generateCards: () => Promise<void>
  downloadPdf: (code: CreateCardsResult, fileName: string) => Promise<void>
}

const useCardGeneratorSelfService = (): UseCardGeneratorSelfServiceReturn => {
  const projectConfig = useContext(ProjectConfigContext)
  const { enqueueSnackbar } = useSnackbar()
  const [searchParams] = useSearchParams()
  const [cardGenerationStep, setCardGenerationStep] =
    useState<SelfServiceCardGenerationStep>('input')
  const [code, setCode] = useState<CreateCardsResult | null>(null)
  const [createCardsSelfService] = useCreateCardsFromSelfServiceMutation()
  const [selfServiceCard, setSelfServiceCard] = useState(() => {
    const headers = getCsvHeaders(projectConfig)
    const values = headers.map(header => searchParams.get(header))
    return initializeCardFromCSV(projectConfig.card, values, headers, undefined, true)
  })

  const generateCards = useCallback(async (): Promise<void> => {
    setCardGenerationStep('loading')
    try {
      const code = await createSelfServiceCard(
        createCardsSelfService,
        projectConfig,
        selfServiceCard,
      )
      setCode(code)
      setCardGenerationStep('information')
    } catch (error) {
      showCardGenerationError(enqueueSnackbar, error)
      setCardGenerationStep('input')
    }
  }, [projectConfig, setCode, createCardsSelfService, enqueueSnackbar, selfServiceCard])

  const downloadPdf = async (code: CreateCardsResult, fileName: string): Promise<void> => {
    const blob = await generatePdf([code], [selfServiceCard], projectConfig)
    downloadDataUri(blob, fileName)
  }

  return {
    cardGenerationStep,
    setCardGenerationStep,
    code,
    selfServiceCard,
    setSelfServiceCard,
    generateCards,
    downloadPdf,
  }
}
export default useCardGeneratorSelfService
