import { useApolloClient } from '@apollo/client'
import { useCallback, useContext, useState } from 'react'

import { CardBlueprint } from '../../../cards/CardBlueprint'
import { CsvError, generateCsv, getCSVFilename } from '../../../cards/CsvFactory'
import { PdfError, generatePdf } from '../../../cards/PdfFactory'
import createCards, { CreateCardsError, CreateCardsResult } from '../../../cards/createCards'
import deleteCards from '../../../cards/deleteCards'
import EMailNotificationExtension from '../../../cards/extensions/EMailNotificationExtension'
import { findExtension } from '../../../cards/extensions/extensions'
import getMessageFromApolloError from '../../../errors/getMessageFromApolloError'
import { Region, useSendCardCreationConfirmationMailMutation } from '../../../generated/graphql'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import downloadDataUri from '../../../util/downloadDataUri'
import getDeepLinkFromQrCode from '../../../util/getDeepLinkFromQrCode'
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
  setCardBlueprints: (cardBlueprints: CardBlueprint[]) => void
  cardBlueprints: CardBlueprint[]
  setApplicationIdToMarkAsProcessed: (applicationId: number | undefined) => void
  applicationIdToMarkAsProcessed: number | undefined
}

const useCardGenerator = (region: Region): UseCardGeneratorReturn => {
  const projectConfig = useContext(ProjectConfigContext)
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
  const [cardBlueprints, setCardBlueprints] = useState<CardBlueprint[]>([])
  const [state, setState] = useState(CardActivationState.input)
  const [applicationIdToMarkAsProcessed, setApplicationIdToMarkAsProcessed] = useState<number>()
  const client = useApolloClient()

  const sendCardConfirmationMails = useCallback(
    async (codes: CreateCardsResult[], cardBlueprints: CardBlueprint[], projectId: string): Promise<void> => {
      for (let k = 0; k < codes.length; k++) {
        const cardBlueprint = cardBlueprints[k]
        const mailNotificationExtension = findExtension(cardBlueprint.extensions, EMailNotificationExtension)
        const dynamicCode = codes[k].dynamicActivationCode
        if (
          !mailNotificationExtension?.state ||
          dynamicCode.info?.extensions?.extensionRegion?.regionId === undefined
        ) {
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
            recipientAddress: mailNotificationExtension.state,
            recipientName: cardBlueprint.fullName,
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
      generateFunction: (codes: CreateCardsResult[], cardBlueprints: CardBlueprint[]) => Promise<Blob> | Blob,
      filename: string,
      applicationIdToMarkAsProcessed?: number
    ): Promise<void> => {
      let codes: CreateCardsResult[] | undefined
      setState(CardActivationState.loading)

      try {
        const cardInfos = cardBlueprints.map(card => card.generateCardInfo())
        codes = await createCards(
          client,
          projectConfig.projectId,
          cardInfos,
          projectConfig.staticQrCodesEnabled,
          applicationIdToMarkAsProcessed
        )

        const dataUri = await generateFunction(codes, cardBlueprints)

        cardBlueprints.forEach(cardBlueprint => new ActivityLog(cardBlueprint).saveToSessionStorage())

        downloadDataUri(dataUri, filename)
        if (region.activatedForCardConfirmationMail) {
          await sendCardConfirmationMails(codes, cardBlueprints, projectConfig.projectId)
        }
        setState(CardActivationState.finished)
      } catch (error) {
        await handleError(error, codes)
      } finally {
        setCardBlueprints([])
      }
    },
    [
      cardBlueprints,
      client,
      projectConfig,
      handleError,
      sendCardConfirmationMails,
      region.activatedForCardConfirmationMail,
    ]
  )

  const generateCardsPdf = useCallback(
    async (applicationIdToMarkAsProcessed?: number) => {
      await generateCards(
        (codes: CreateCardsResult[], cardBlueprints: CardBlueprint[]) =>
          generatePdf(codes, cardBlueprints, projectConfig.pdf, region),
        'berechtigungskarten.pdf',
        applicationIdToMarkAsProcessed
      )
    },
    [projectConfig, region, generateCards]
  )

  const generateCardsCsv = useCallback(
    async (applicationIdToMarkAsProcessed?: number) => {
      await generateCards(
        (codes: CreateCardsResult[], cardBlueprints: CardBlueprint[]) =>
          generateCsv(codes, cardBlueprints, projectConfig.csvExport),
        getCSVFilename(cardBlueprints),
        applicationIdToMarkAsProcessed
      )
    },
    [cardBlueprints, generateCards, projectConfig.csvExport]
  )

  return {
    state,
    setState,
    generateCardsPdf,
    generateCardsCsv,
    setCardBlueprints,
    cardBlueprints,
    setApplicationIdToMarkAsProcessed,
    applicationIdToMarkAsProcessed,
  }
}

export default useCardGenerator
