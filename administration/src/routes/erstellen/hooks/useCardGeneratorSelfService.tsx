import { useSnackbar } from 'notistack'
import { useCallback, useContext, useState } from 'react'
import { useSearchParams } from 'react-router'
import { useMutation } from 'urql'

import { Card, initializeCardFromCSV } from '../../../cards/card'
import { showCardGenerationError } from '../../../cards/cardGenerationError'
import { CreateCardsResult, createSelfServiceCard } from '../../../cards/createCards'
import { generatePdf } from '../../../cards/pdf/pdfFactory'
import { CreateCardsFromSelfServiceDocument } from '../../../graphql'
import { getCsvHeaders } from '../../../project-configs/helper'
import { ProjectConfigContext } from '../../../provider/ProjectConfigContext'
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
  const [, createCardsFromSelfServiceMutation] = useMutation(CreateCardsFromSelfServiceDocument)
  const [selfServiceCard, setSelfServiceCard] = useState(() => {
    const headers = getCsvHeaders(projectConfig)
    const values = headers.map(header => searchParams.get(header))
    return initializeCardFromCSV(projectConfig.card, values, headers, undefined, true)
  })

  return {
    cardGenerationStep,
    setCardGenerationStep,
    code,
    selfServiceCard,
    setSelfServiceCard,
    generateCards: useCallback(async (): Promise<void> => {
      setCardGenerationStep('loading')
      try {
        const code = await createSelfServiceCard(
          createCardsFromSelfServiceMutation,
          projectConfig,
          selfServiceCard,
        )
        setCode(code)
        setCardGenerationStep('information')
      } catch (error) {
        showCardGenerationError(enqueueSnackbar, error)
        setCardGenerationStep('input')
      }
    }, [
      projectConfig,
      setCode,
      createCardsFromSelfServiceMutation,
      enqueueSnackbar,
      selfServiceCard,
    ]),
    downloadPdf: async (code: CreateCardsResult, fileName: string): Promise<void> => {
      downloadDataUri(await generatePdf([code], [selfServiceCard], projectConfig), fileName)
    },
  }
}
export default useCardGeneratorSelfService
