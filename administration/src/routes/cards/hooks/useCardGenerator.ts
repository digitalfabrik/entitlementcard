import { useSnackbar } from 'notistack'
import { useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { Card, initializeCardFromCSV, updateCard as updateCardObject } from '../../../cards/Card'
import { generateCsv, getCSVFilename } from '../../../cards/CsvFactory'
import { showCardGenerationError } from '../../../cards/cardGenerationError'
import createCards, { CreateCardsResult } from '../../../cards/createCards'
import deleteCards from '../../../cards/deleteCards'
import getDeepLinkFromQrCode from '../../../cards/getDeepLinkFromQrCode'
import { generatePdf, getPdfFilename } from '../../../cards/pdf/PdfFactory'
import getMessageFromApolloError from '../../../errors/getMessageFromApolloError'
import {
  Region,
  useCreateCardsMutation,
  useDeleteCardsMutation,
  useSendApplicationAndCardDataToFreinetMutation,
} from '../../../generated/graphql'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import { ProjectConfig } from '../../../project-configs/getProjectConfig'
import { getCsvHeaders } from '../../../project-configs/helper'
import downloadDataUri from '../../../util/downloadDataUri'
import { getBuildConfig } from '../../../util/getBuildConfig'
import { isProductionEnvironment, updateArrayItem } from '../../../util/helper'
import { normalizeWhitespace } from '../../../util/normalizeString'
import { reportErrorToSentry } from '../../../util/sentry'
import { saveActivityLog } from '../../activity-log/utils/ActivityLog'
import { getFreinetCardFromCards } from '../utils/getFreinetCardFromCards'
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
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation('cards')

  const [sendToFreinet] = useSendApplicationAndCardDataToFreinetMutation({
    onCompleted: data => {
      if (data.sendApplicationAndCardDataToFreinet === true) {
        enqueueSnackbar(t('freinetDataSyncSuccessMessage'), { variant: 'success' })
      }
    },
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      enqueueSnackbar(title, { variant: 'error', persist: true })
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

      // Normalize each card's full name
      const normalizedCards = cards.map(card => ({ ...card, fullName: normalizeWhitespace(card.fullName) }))

      try {
        codes = await createCards(createCardsMutation, projectConfig, normalizedCards, applicationId)
        const dataUri = await generateFunction(codes, normalizedCards, projectConfig, region)
        downloadDataUri(dataUri, filename)
        normalizedCards.forEach(saveActivityLog)

        // This is a temporary condition from #2141
        if (!isProductionEnvironment() && applicationId != null) {
          const freinetCard = getFreinetCardFromCards(normalizedCards)
          sendToFreinet({
            variables: {
              applicationId,
              freinetCard,
            },
          })
        }

        if (region.activatedForCardConfirmationMail) {
          await sendConfirmationMails(codes, normalizedCards)
        } else if (!isProductionEnvironment()) {
          // print deep links in the console for testing purposes
          codes.forEach(code =>
            getDeepLinkFromQrCode(
              { case: 'dynamicActivationCode', value: code.dynamicActivationCode },
              getBuildConfig(window.location.hostname),
              isProductionEnvironment()
            )
          )
        }

        setCardGenerationStep('finished')
      } catch (error) {
        if (codes) {
          // Rollback
          await deleteCards(deleteCardsMutation, region.id, codes).catch(reportErrorToSentry)
        }
        showCardGenerationError(enqueueSnackbar, error)
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
      enqueueSnackbar,
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
