import { useApolloClient } from '@apollo/client'
import { useCallback, useContext, useState } from 'react'

import { CardBlueprint } from '../../../cards/CardBlueprint'
import { generatePdf } from '../../../cards/PdfFactory'
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

  const generateCards = useCallback(async () => {
    let codes: CreateCardsResult[] | undefined
    setState(CardActivationState.loading)

    try {
      const cardInfos = cardBlueprints.map(card => card.generateCardInfo())
      codes = await createCards(client, projectConfig.projectId, cardInfos, projectConfig.staticQrCodesEnabled)

      const pdfDataUri = await generatePdf(codes, cardBlueprints, region, projectConfig.pdf)

      cardBlueprints.forEach(cardBlueprint => new ActivityLog(cardBlueprint).saveToSessionStorage())
      downloadDataUri(pdfDataUri, 'berechtigungskarten.pdf')
      setState(CardActivationState.finished)
    } catch (e) {
      if (codes !== undefined) {
        // try rollback
        try {
          await deleteCards(client, region.id, extractCardInfoHashes(codes))
        } catch {}
      }
      if (e instanceof CreateCardsError) {
        appToaster?.show({
          message: e.message,
          intent: 'danger',
        })
      } else {
        appToaster?.show({
          message: 'Etwas ist schiefgegangen beim erstellen der PDF.',
          intent: 'danger',
        })
      }
      setState(CardActivationState.input)
    } finally {
      setCardBlueprints([])
    }
  }, [appToaster, cardBlueprints, client, projectConfig, region])

  return { state, setState, generateCards, setCardBlueprints, cardBlueprints }
}

export default useCardGenerator
