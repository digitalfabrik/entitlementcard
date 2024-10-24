import { useApolloClient } from '@apollo/client'
import { useCallback, useContext, useState } from 'react'

import { Card, generateCardInfo, updateCard as updateCardObject } from '../../../cards/Card'
import { CsvError, generateCsv, getCSVFilename } from '../../../cards/CsvFactory'
import { PdfError, generatePdf } from '../../../cards/PdfFactory'
import createCards, { CreateCardsError, CreateCardsResult } from '../../../cards/createCards'
import deleteCards from '../../../cards/deleteCards'
import { EMAIL_NOTIFICATION_EXTENSION_NAME } from '../../../cards/extensions/EMailNotificationExtension'
import getMessageFromApolloError from '../../../errors/getMessageFromApolloError'
import { Region, useSendCardCreationConfirmationMailMutation } from '../../../generated/graphql'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import downloadDataUri from '../../../util/downloadDataUri'
import getDeepLinkFromQrCode from '../../../util/getDeepLinkFromQrCode'
import { updateArrayItem } from '../../../util/helper'
import { useAppToaster } from '../../AppToaster'
import { ActivityLog } from '../../user-settings/ActivityLog'

export enum CardActivationState {
  input,
  loading,
  finished,
}

const extractCardInfoHashes = (codes: CreateCardsResult[]) =>
  codes.flatMap(code => {
    if (code.staticCardInfoHashBase64) {
      return [code.dynamicCardInfoHashBase64, code.staticCardInfoHashBase64]
    }
    return code.dynamicCardInfoHashBase64
  })

type UseCardGeneratorReturn = {
  state: CardActivationState
  setState: (state: CardActivationState) => void
  generateCardsPdf: (applicationId?: number) => Promise<void>
  generateCardsCsv: (applicationId?: number) => Promise<void>
  setCards: (cards: Card[]) => void
  updateCard: (updatedCard: Partial<Card>, index: number) => void
  cards: Card[]
  setApplicationIdToMarkAsProcessed: (applicationId: number | undefined) => void
  applicationIdToMarkAsProcessed: number | undefined
}

const useCardGenerator = (region: Region): UseCardGeneratorReturn => {
  const projectConfig = useContext(ProjectConfigContext)
  const [cards, setCards] = useState<Card[]>([])
  const [state, setState] = useState(CardActivationState.input)
  const [applicationIdToMarkAsProcessed, setApplicationIdToMarkAsProcessed] = useState<number>()
  const client = useApolloClient()
  const appToaster = useAppToaster()
  const [sendMail] = useSendCardCreationConfirmationMailMutation({
    onCompleted: () => {
      appToaster?.show({ intent: 'success', message: 'Bestätigungsmail wurde versendet.' })
    },
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({
        intent: 'danger',
        message: title,
        timeout: 0,
      })
    },
  })

  const updateCard = useCallback(
    (updatedCard: Partial<Card>, index: number) =>
      setCards(updateArrayItem(cards, updateCardObject(cards[index], updatedCard), index)),
    [cards]
  )

  const sendCardConfirmationMails = useCallback(
    async (codes: CreateCardsResult[], cards: Card[], projectId: string): Promise<void> => {
      for (let k = 0; k < codes.length; k++) {
        const card = cards[k]
        const mailNotificationExtensionState = card.extensions[EMAIL_NOTIFICATION_EXTENSION_NAME]
        const dynamicCode = codes[k].dynamicActivationCode
        if (!mailNotificationExtensionState || dynamicCode.info?.extensions?.extensionRegion?.regionId === undefined) {
          return
        }
        const deepLink = getDeepLinkFromQrCode({
          case: 'dynamicActivationCode',
          value: dynamicCode,
        })
        // eslint-disable-next-line no-await-in-loop
        await sendMail({
          variables: {
            project: projectId,
            regionId: dynamicCode.info.extensions.extensionRegion.regionId,
            recipientAddress: mailNotificationExtensionState,
            recipientName: card.fullName,
            deepLink,
          },
        })
      }
    },
    [sendMail]
  )

  const handleError = useCallback(
    async (error: unknown, codes: CreateCardsResult[] | undefined) => {
      if (codes !== undefined) {
        // try rollback
        try {
          await deleteCards(client, region.id, extractCardInfoHashes(codes))
        } catch (e) {
          console.log(e)
        }
      }
      if (error instanceof CreateCardsError) {
        appToaster?.show({
          message: error.message,
          intent: 'danger',
        })
      } else if (error instanceof PdfError) {
        appToaster?.show({
          message: 'Etwas ist schiefgegangen beim Erstellen der PDF.',
          intent: 'danger',
        })
      } else if (error instanceof CsvError) {
        appToaster?.show({
          message: 'Etwas ist schiefgegangen beim Erstellen der CSV.',
          intent: 'danger',
        })
      } else {
        appToaster?.show({
          message: 'Unbekannter Fehler: Etwas ist schiefgegangen.',
          intent: 'danger',
        })
      }
      setState(CardActivationState.input)
    },
    [appToaster, client, region]
  )

  const generateCards = useCallback(
    async (
      generateFunction: (codes: CreateCardsResult[], cards: Card[]) => Promise<Blob> | Blob,
      filename: string,
      applicationIdToMarkAsProcessed?: number
    ): Promise<void> => {
      let codes: CreateCardsResult[] | undefined
      setState(CardActivationState.loading)

      try {
        const cardInfos = cards.map(generateCardInfo)
        codes = await createCards(
          client,
          projectConfig.projectId,
          cardInfos,
          projectConfig.staticQrCodesEnabled,
          applicationIdToMarkAsProcessed
        )

        const dataUri = await generateFunction(codes, cards)

        cards.forEach(card => new ActivityLog(card).saveToSessionStorage())

        downloadDataUri(dataUri, filename)
        if (region.activatedForCardConfirmationMail) {
          await sendCardConfirmationMails(codes, cards, projectConfig.projectId)
        }
        setState(CardActivationState.finished)
      } catch (error) {
        await handleError(error, codes)
      } finally {
        setCards([])
      }
    },
    [cards, client, projectConfig, handleError, sendCardConfirmationMails, region.activatedForCardConfirmationMail]
  )

  const generateCardsPdf = useCallback(
    async (applicationIdToMarkAsProcessed?: number) => {
      await generateCards(
        (codes: CreateCardsResult[], cards: Card[]) => generatePdf(codes, cards, projectConfig.pdf, region),
        'berechtigungskarten.pdf',
        applicationIdToMarkAsProcessed
      )
    },
    [projectConfig, region, generateCards]
  )

  const generateCardsCsv = useCallback(
    async (applicationIdToMarkAsProcessed?: number) => {
      await generateCards(
        (codes: CreateCardsResult[], cards: Card[]) => generateCsv(codes, cards, projectConfig.csvExport),
        getCSVFilename(cards),
        applicationIdToMarkAsProcessed
      )
    },
    [cards, generateCards, projectConfig.csvExport]
  )

  return {
    state,
    setState,
    generateCardsPdf,
    generateCardsCsv,
    setCards: setCards,
    cards: cards,
    updateCard: updateCard,
    setApplicationIdToMarkAsProcessed,
    applicationIdToMarkAsProcessed,
  }
}

export default useCardGenerator
