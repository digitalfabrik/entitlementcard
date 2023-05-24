import { useApolloClient } from '@apollo/client'
import { useCallback, useContext, useState } from 'react'

import { CardBlueprint } from '../../../cards/CardBlueprint'
import { generatePdf } from '../../../cards/PdfFactory'
import createCards, { CreateCardsError } from '../../../cards/createCards'
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

const useCardGenerator = (region: Region) => {
  const projectConfig = useContext(ProjectConfigContext)

  const [cardBlueprints, setCardBlueprints] = useState<CardBlueprint[]>([])
  const [state, setState] = useState(CardActivationState.input)
  const client = useApolloClient()
  const appToaster = useAppToaster()

  const generateCards = useCallback(async () => {
    try {
      setState(CardActivationState.loading)

      const dynamicCodes = cardBlueprints.map(cardBlueprint => {
        if (projectConfig.activityLogConfig) {
          new ActivityLog(cardBlueprint).saveToSessionStorage()
        }
        return cardBlueprint.generateActivationCode()
      })
      const staticCodes = projectConfig.staticQrCodesEnabled
        ? cardBlueprints.map(cardBlueprints => {
            return cardBlueprints.generateStaticVerificationCode()
          })
        : []

      const pdfDataUri = await generatePdf(dynamicCodes, staticCodes, region, projectConfig.pdf)

      const codes = [...dynamicCodes, ...staticCodes]
      await createCards(client, codes, region)

      downloadDataUri(pdfDataUri, 'berechtigungskarten.pdf')
      setState(CardActivationState.finished)
    } catch (e) {
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
