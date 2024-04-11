import { useApolloClient } from '@apollo/client'
import { useCallback, useContext, useState } from 'react'

import { CardBlueprint } from '../../../cards/CardBlueprint'
import { CsvError, generateCsv, getCSVFilename } from '../../../cards/CsvFactory'
import { PdfError, generatePdf } from '../../../cards/PdfFactory'
import createCards, { CreateCardsError, CreateCardsResult } from '../../../cards/createCards'
import deleteCards from '../../../cards/deleteCards'
import { Region } from '../../../generated/graphql'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import downloadDataUri from '../../../util/downloadDataUri'
import { useAppToaster } from '../../AppToaster'
import { ActivityLog } from '../../user-settings/ActivityLog'

export enum CardActivationState {
  input,
  loading,
  finished,
}

const extractCardInfoHashes = (codes: CreateCardsResult[]) => {
  return codes.flatMap(code => {
    if (code.staticCardInfoHashBase64) {
      return [code.dynamicCardInfoHashBase64, code.staticCardInfoHashBase64]
    }
    return code.dynamicCardInfoHashBase64
  })
}

const useCardGenerator = (region: Region) => {
  const projectConfig = useContext(ProjectConfigContext)

  const [cardBlueprints, setCardBlueprints] = useState<CardBlueprint[]>([])
  const [state, setState] = useState(CardActivationState.input)
  const client = useApolloClient()
  const appToaster = useAppToaster()

  const handleError = useCallback(
    async (error: unknown, codes: CreateCardsResult[] | undefined) => {
      if (codes !== undefined) {
        // try rollback
        try {
          await deleteCards(client, region.id, extractCardInfoHashes(codes))
        } catch {}
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
      generateFunction: (codes: CreateCardsResult[], cardBlueprints: CardBlueprint[]) => Promise<Blob>,
      filename: string
    ) => {
      let codes: CreateCardsResult[] | undefined
      setState(CardActivationState.loading)

      try {
        const cardInfos = cardBlueprints.map(card => card.generateCardInfo())
        codes = await createCards(client, projectConfig.projectId, cardInfos, projectConfig.staticQrCodesEnabled)

        const dataUri = await generateFunction(codes, cardBlueprints)

        cardBlueprints.forEach(cardBlueprint => new ActivityLog(cardBlueprint).saveToSessionStorage())

        downloadDataUri(dataUri, filename)
        setState(CardActivationState.finished)
      } catch (error) {
        handleError(error, codes)
      } finally {
        setCardBlueprints([])
      }
    },
    [cardBlueprints, client, projectConfig, handleError]
  )

  const generateCardsPdf = useCallback(async () => {
    generateCards(
      (codes: CreateCardsResult[], cardBlueprints: CardBlueprint[]) =>
        generatePdf(codes, cardBlueprints, region, projectConfig.pdf),
      'berechtigungskarten.pdf'
    )
  }, [projectConfig, region, generateCards])

  const generateCardsCsv = useCallback(async () => {
    generateCards(generateCsv, getCSVFilename(cardBlueprints))
  }, [cardBlueprints, generateCards])

  return { state, setState, generateCardsPdf, generateCardsCsv, setCardBlueprints, cardBlueprints }
}

export default useCardGenerator
