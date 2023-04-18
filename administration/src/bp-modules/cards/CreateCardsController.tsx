import { useApolloClient } from '@apollo/client'
import { NonIdealState, Spinner } from '@blueprintjs/core'
import { useContext, useState } from 'react'

import { WhoAmIContext } from '../../WhoAmIProvider'
import { CardBlueprint } from '../../cards/CardBlueprint'
import { PDFError, generatePdf } from '../../cards/PdfFactory'
import { CreateCardsError, createCards } from '../../cards/creation'
import { Region } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import downloadDataUri from '../../util/downloadDataUri'
import { useAppToaster } from '../AppToaster'
import GenerationFinished from './CardsCreatedMessage'
import CreateCardsForm from './CreateCardsForm'

enum CardActivationState {
  input,
  loading,
  finished,
}

const CreateCardsController = () => {
  const { region } = useContext(WhoAmIContext).me!

  if (!region) {
    return (
      <NonIdealState
        icon='cross'
        title='Fehlende Berechtigung'
        description='Sie sind nicht berechtigt, Karten auszustellen.'
      />
    )
  }

  return <InnerCreateCardsController region={region} />
}

const InnerCreateCardsController = ({ region }: { region: Region }) => {
  const projectConfig = useContext(ProjectConfigContext)
  const client = useApolloClient()
  const appToaster = useAppToaster()

  const [cardBlueprints, setCardBlueprints] = useState<CardBlueprint[]>([projectConfig.createEmptyCard(region)])
  const [state, setState] = useState(CardActivationState.input)

  const confirm = async () => {
    try {
      setState(CardActivationState.loading)

      const dynamicCodes = cardBlueprints.map(cardBlueprint => {
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
      if (e instanceof PDFError)
        appToaster?.show({
          message: 'Etwas ist schiefgegangen beim erstellen der PDF.',
          intent: 'danger',
        })
      else if (e instanceof CreateCardsError) {
        appToaster?.show({ intent: 'danger', message: e.message })
      } else {
        console.error(e)
        appToaster?.show({ intent: 'danger', message: 'Etwas ist schiefgegangen.' })
      }
      setState(CardActivationState.input)
    }
  }
  if (state === CardActivationState.input) {
    return (
      <CreateCardsForm
        region={region}
        cardBlueprints={cardBlueprints}
        setCardBlueprints={setCardBlueprints}
        confirm={confirm}
      />
    )
  } else if (state === CardActivationState.loading) {
    return <Spinner />
  } else {
    return (
      <GenerationFinished
        reset={() => {
          setCardBlueprints([])
          setState(CardActivationState.input)
        }}
      />
    )
  }
}

export default CreateCardsController
