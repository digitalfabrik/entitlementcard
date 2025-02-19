import { useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { Card, initializeCardFromCSV, updateCard as updateCardObject } from '../../../cards/Card'
import { generateCsv, getCSVFilename } from '../../../cards/CsvFactory'
import { generatePdf, getPdfFilename } from '../../../cards/PdfFactory'
import createCards, { CreateCardsResult } from '../../../cards/createCards'
import deleteCards from '../../../cards/deleteCards'
import { Region, useCreateCardsMutation, useDeleteCardsMutation } from '../../../generated/graphql'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import { ProjectConfig } from '../../../project-configs/getProjectConfig'
import { getCsvHeaders } from '../../../project-configs/helper'
import downloadDataUri from '../../../util/downloadDataUri'
import { updateArrayItem } from '../../../util/helper'
import { reportErrorToSentry } from '../../../util/sentry'
import { useAppToaster } from '../../AppToaster'
import { saveActivityLog } from '../../user-settings/ActivityLog'
import { showCardGenerationError } from '../../util/cardGenerationError'
import useSendCardConfirmationMails from './useSendCardConfirmationMails'

export enum CardActivationState {
  input,
  loading,
  finished,
}

type GenerateCardFunction = (
  codes: CreateCardsResult[],
  cards: Card[],
  projectConfig: ProjectConfig,
  region?: Region
) => Promise<Blob> | Blob

type UseCardGeneratorReturn = {
  state: CardActivationState
  setState: (state: CardActivationState) => void
  generateCardsPdf: () => Promise<void>
  generateCardsCsv: () => Promise<void>
  setCards: (cards: Card[]) => void
  updateCard: (updatedCard: Partial<Card>, index: number) => void
  cards: Card[]
}

const useCardGenerator = (region: Region): UseCardGeneratorReturn => {
  const projectConfig = useContext(ProjectConfigContext)
  const [searchParams] = useSearchParams()
  const [state, setState] = useState(CardActivationState.input)
  const [createCardsMutation] = useCreateCardsMutation()
  const [deleteCardsMutation] = useDeleteCardsMutation()
  const appToaster = useAppToaster()
  const sendConfirmationMails = useSendCardConfirmationMails()
  const { t } = useTranslation('errors')
  const [cards, setCards] = useState<Card[]>(() => {
    const headers = getCsvHeaders(projectConfig)
    const values = headers.map(header => searchParams.get(header))
    return [initializeCardFromCSV(projectConfig.card, values, headers, region, true)]
  })
  const rawApplicationId = searchParams.get('applicationIdToMarkAsProcessed')
  const applicationId = rawApplicationId ? parseInt(rawApplicationId, 10) : null

  const updateCard = useCallback(
    (updatedCard: Partial<Card>, index: number) =>
      setCards(updateArrayItem(cards, updateCardObject(cards[index], updatedCard), index)),
    [cards]
  )

  const generateCards = useCallback(
    async (generateFunction: GenerateCardFunction, filename: string): Promise<void> => {
      let codes: CreateCardsResult[] | undefined
      setState(CardActivationState.loading)

      try {
        codes = await createCards(createCardsMutation, projectConfig, cards, t, applicationId)
        const dataUri = await generateFunction(codes, cards, projectConfig, region)
        downloadDataUri(dataUri, filename)
        cards.forEach(saveActivityLog)

        if (region.activatedForCardConfirmationMail) {
          await sendConfirmationMails(codes, cards)
        }

        setState(CardActivationState.finished)
      } catch (error) {
        if (codes) {
          // Rollback
          await deleteCards(deleteCardsMutation, region.id, codes, t).catch(reportErrorToSentry)
        }
        if (appToaster) {
          showCardGenerationError(appToaster, error, t)
        }
        setState(CardActivationState.input)
      } finally {
        setCards([])
      }
    },
    [
      cards,
      createCardsMutation,
      deleteCardsMutation,
      projectConfig,
      appToaster,
      sendConfirmationMails,
      region,
      applicationId,
      t,
    ]
  )

  const generateCardsPdf = useCallback(
    async () => generateCards(generatePdf, getPdfFilename(cards)),
    [generateCards, cards]
  )

  const generateCardsCsv = useCallback(
    async () => generateCards(generateCsv, getCSVFilename(cards)),
    [cards, generateCards]
  )

  return {
    state,
    setState,
    generateCardsPdf,
    generateCardsCsv,
    setCards,
    cards,
    updateCard,
  }
}

export default useCardGenerator
