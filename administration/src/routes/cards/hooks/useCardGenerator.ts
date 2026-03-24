import { useSnackbar } from 'notistack'
import { useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { useMutation } from 'urql'

import { Card, initializeCardFromCSV, updateCard as updateCardObject } from '../../../cards/card'
import { showCardGenerationError } from '../../../cards/cardGenerationError'
import createCards, { CreateCardsResult } from '../../../cards/createCards'
import { generateCsv, getCSVFilename } from '../../../cards/csvFactory'
import deleteCards from '../../../cards/deleteCards'
import getDeepLinkFromQrCode from '../../../cards/getDeepLinkFromQrCode'
import { generatePdf, getPdfFilename } from '../../../cards/pdf/pdfFactory'
import { messageFromGraphQlError } from '../../../errors'
import {
  CreateCardsDocument,
  DeleteCardsDocument,
  Region,
  SendApplicationAndCardDataToFreinetDocument,
} from '../../../graphql'
import { ProjectConfig } from '../../../project-configs'
import { getCsvHeaders } from '../../../project-configs/helper'
import { ProjectConfigContext } from '../../../provider/ProjectConfigContext'
import downloadDataUri from '../../../util/downloadDataUri'
import { getBuildConfig } from '../../../util/getBuildConfig'
import { isProductionEnvironment, updateArrayItem } from '../../../util/helper'
import { normalizeWhitespace } from '../../../util/normalizeString'
import { reportErrorToSentry } from '../../../util/sentry'
import { saveActivityLog } from '../../activity-log/utils/activityLog'
import {
  getFreinetCardFromCard,
  getFreinetCardWithUserIdFromCard,
} from '../utils/freinetCardMapper'
import useSendCardConfirmationMails from './useSendCardConfirmationMails'
import useSendCardDataToFreinet from './useSendCardDataToFreinet'

type Region = NonNullable<WhoAmIQuery['me']['region']>

const initializeCardsFromQueryParams = (
  projectConfig: ProjectConfig,
  searchParams: URLSearchParams,
  region: Pick<Region, 'id' | 'name'>,
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
  region?: Pick<Region, 'id' | 'name' | 'prefix'>,
) => Promise<Blob> | Blob

type UseCardGeneratorReturn = {
  cardGenerationStep: CardGenerationStep
  setCardGenerationStep: (state: CardGenerationStep) => void
  generateCardsPdf: () => Promise<void>
  generateCardsCsv: () => Promise<void>
  setCards: (cards: Card[]) => void
  updateCard: (updatedCard: Partial<Card>, index: number) => void
  cards: Card[]
}

const useCardGenerator = ({
  region,
  initializeCards = true,
}: {
  region: Pick<Region, 'id' | 'name' | 'activatedForCardConfirmationMail' | 'prefix'>
  initializeCards?: boolean
}): UseCardGeneratorReturn => {
  const projectConfig = useContext(ProjectConfigContext)
  const [searchParams] = useSearchParams()
  const [cardGenerationStep, setCardGenerationStep] = useState<CardGenerationStep>('input')
  const [, createCardsMutation] = useMutation(CreateCardsDocument)
  const [, deleteCardsMutation] = useMutation(DeleteCardsDocument)
  const [, sendApplicationAndCardDataToFreinetMutation] = useMutation(
    SendApplicationAndCardDataToFreinetDocument,
  )
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation('cards')
  const sendCardDataToFreinet = useSendCardDataToFreinet()

  const sendConfirmationMails = useSendCardConfirmationMails(region)
  const initializedCards = initializeCards
    ? initializeCardsFromQueryParams(projectConfig, searchParams, region)
    : []
  const [cards, setCards] = useState<Card[]>(initializedCards)
  const rawApplicationId = searchParams.get('applicationIdToMarkAsProcessed')
  const applicationId = rawApplicationId ? parseInt(rawApplicationId, 10) : null

  const updateCard = useCallback(
    (updatedCard: Partial<Card>, index: number) =>
      setCards(updateArrayItem(cards, updateCardObject(cards[index], updatedCard), index)),
    [cards],
  )

  const generateCards = useCallback(
    async (generateFunction: GenerateCardFunction, filename: string): Promise<void> => {
      let codes: CreateCardsResult[] | undefined
      setCardGenerationStep('loading')

      // Normalize each card's full name
      const normalizedCards = cards.map(card => ({
        ...card,
        fullName: normalizeWhitespace(card.fullName),
      }))

      try {
        codes = await createCards(
          createCardsMutation,
          projectConfig,
          normalizedCards,
          applicationId,
        )
        const dataUri = await generateFunction(codes, normalizedCards, projectConfig, region)
        downloadDataUri(dataUri, filename)
        normalizedCards.forEach(saveActivityLog)

        if (applicationId != null) {
          const freinetCard = getFreinetCardFromCard(normalizedCards[0])
          const result = await sendApplicationAndCardDataToFreinetMutation({
            applicationId,
            freinetCard,
          })

          if (result.error) {
            const { title } = messageFromGraphQlError(result.error)
            enqueueSnackbar(title, { variant: 'error', persist: true })
          } else if (result.data?.sendApplicationAndCardDataToFreinet === true) {
            enqueueSnackbar(t('freinetDataSyncSuccessMessage'), { variant: 'success' })
          }
        } else {
          const cardsWithFreinetUserId = normalizedCards.flatMap(card =>
            card.extensions.freinetUserId ? [getFreinetCardWithUserIdFromCard(card)] : [],
          )
          sendCardDataToFreinet(cardsWithFreinetUserId)
        }

        if (region.activatedForCardConfirmationMail) {
          await sendConfirmationMails(codes, normalizedCards)
        } else if (!isProductionEnvironment()) {
          // print deep links in the console for testing purposes
          codes.forEach(code =>
            getDeepLinkFromQrCode(
              { case: 'dynamicActivationCode', value: code.dynamicActivationCode },
              getBuildConfig(window.location.hostname),
              isProductionEnvironment(),
            ),
          )
        }

        setCardGenerationStep('finished')
      } catch (error) {
        if (codes) {
          // Rollback
          try {
            await deleteCards(deleteCardsMutation, region.id, codes)
          } catch (error) {
            reportErrorToSentry(error)
          }
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
      sendApplicationAndCardDataToFreinetMutation,
      sendCardDataToFreinet,
      sendConfirmationMails,
      enqueueSnackbar,
      deleteCardsMutation,
      t,
    ],
  )

  const generateCardsPdf = useCallback(
    async () => generateCards(generatePdf, getPdfFilename(cards)),
    [generateCards, cards],
  )

  const generateCardsCsv = useCallback(
    async () => generateCards(generateCsv, getCSVFilename(cards)),
    [cards, generateCards],
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
