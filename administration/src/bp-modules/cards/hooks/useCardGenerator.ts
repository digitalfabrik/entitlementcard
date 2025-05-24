import { useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { Card, initializeCardFromCSV, updateCard as updateCardObject } from '../../../cards/Card'
import { generateCsv, getCSVFilename } from '../../../cards/CsvFactory'
import { generatePdf, getPdfFilename } from '../../../cards/PdfFactory'
import createCards, { CreateCardsResult } from '../../../cards/createCards'
import deleteCards from '../../../cards/deleteCards'
import getMessageFromApolloError from '../../../errors/getMessageFromApolloError'
import {
  Region,
  useCreateCardsMutation,
  useDeleteCardsMutation,
  useSendApplicationDataToFreinetMutation,
} from '../../../generated/graphql'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import { ProjectConfig } from '../../../project-configs/getProjectConfig'
import { getCsvHeaders } from '../../../project-configs/helper'
import downloadDataUri from '../../../util/downloadDataUri'
import { isProductionEnvironment, updateArrayItem } from '../../../util/helper'
import { reportErrorToSentry } from '../../../util/sentry'
import { useAppToaster } from '../../AppToaster'
import { saveActivityLog } from '../../activity-log/ActivityLog'
import { showCardGenerationError } from '../../util/cardGenerationError'
import useSendCardConfirmationMails from './useSendCardConfirmationMails'

const initializeCardsFromQueryParams = (
  projectConfig: ProjectConfig,
  searchParams: URLSearchParams,
  region: Region
) => {
  const headers = getCsvHeaders(projectConfig)
  const values = headers.map(header => searchParams.get(header))
  return [initializeCardFromCSV(projectConfig.card, values, headers, region, true)]
}

type CardGenerationStep = 'input' | 'loading' | 'finished'

type GenerateCardFunction = (
  codes: CreateCardsResult[],
  cards: Card[],
  projectConfig: ProjectConfig,
  region?: Region
) => Promise<Blob> | Blob

type UseCardGeneratorProps = {
  region: Region
  initializeCards?: boolean
}

type UseCardGeneratorReturn = {
  cardGenerationStep: CardGenerationStep
  setCardGenerationStep: (state: CardGenerationStep) => void
  generateCardsPdf: () => Promise<void>
  generateCardsCsv: () => Promise<void>
  setCards: (cards: Card[]) => void
  updateCard: (updatedCard: Partial<Card>, index: number) => void
  cards: Card[]
}

const useCardGenerator = ({ region, initializeCards = true }: UseCardGeneratorProps): UseCardGeneratorReturn => {
  const projectConfig = useContext(ProjectConfigContext)
  const [searchParams] = useSearchParams()
  const [cardGenerationStep, setCardGenerationStep] = useState<CardGenerationStep>('input')
  const [createCardsMutation] = useCreateCardsMutation()
  const [deleteCardsMutation] = useDeleteCardsMutation()
  const appToaster = useAppToaster()
  const { t } = useTranslation('cards')

  const [sendToFreinet] = useSendApplicationDataToFreinetMutation({
    onCompleted: data => {
      if (data.sendApplicationDataToFreinet === true) {
        appToaster?.show({ intent: 'success', message: t('freinetDataSyncSuccessMessage') })
      }
    },
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
  })
  const sendConfirmationMails = useSendCardConfirmationMails()
  const initializedCards = initializeCards ? initializeCardsFromQueryParams(projectConfig, searchParams, region) : []
  const [cards, setCards] = useState<Card[]>(initializedCards)
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
      setCardGenerationStep('loading')

      try {
        codes = await createCards(createCardsMutation, projectConfig, cards, applicationId)
        const dataUri = await generateFunction(codes, cards, projectConfig, region)
        downloadDataUri(dataUri, filename)
        cards.forEach(saveActivityLog)

        if (!isProductionEnvironment() && applicationId != null) {
          const { projectId } = projectConfig
          sendToFreinet({
            variables: {
              applicationId,
              project: projectId,
            },
          })
        }

        if (region.activatedForCardConfirmationMail) {
          await sendConfirmationMails(codes, cards)
        }

        setCardGenerationStep('finished')
      } catch (error) {
        if (codes) {
          // Rollback
          await deleteCards(deleteCardsMutation, region.id, codes).catch(reportErrorToSentry)
        }
        if (appToaster) {
          showCardGenerationError(appToaster, error)
        }
        setCardGenerationStep('input')
      } finally {
        setCards([])
      }
    },
    [
      createCardsMutation,
      projectConfig,
      cards,
      applicationId,
      region,
      sendToFreinet,
      sendConfirmationMails,
      appToaster,
      deleteCardsMutation,
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
    cardGenerationStep,
    setCardGenerationStep,
    generateCardsPdf,
    generateCardsCsv,
    setCards,
    cards,
    updateCard,
  }
}

export default useCardGenerator
