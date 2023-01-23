import React, { useContext, useState } from 'react'
import { Spinner } from '@blueprintjs/core'
import { CardBlueprint } from '../../cards/CardBlueprint'
import CreateCardsForm from './CreateCardsForm'
import { useApolloClient } from '@apollo/client'
import { useAppToaster } from '../AppToaster'
import GenerationFinished from './CardsCreatedMessage'
import downloadDataUri from '../../util/downloadDataUri'
import { WhoAmIContext } from '../../WhoAmIProvider'
import { activateCards } from '../../cards/activation'
import { generatePdf } from '../../cards/PdfFactory'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'

enum CardActivationState {
  input,
  loading,
  finished,
}

const CreateCardsController = () => {
  const [cardBlueprints, setCardBlueprints] = useState<CardBlueprint[]>([])
  const client = useApolloClient()
  const projectConfig = useContext(ProjectConfigContext)
  const { region } = useContext(WhoAmIContext).me!
  const [state, setState] = useState(CardActivationState.input)
  const appToaster = useAppToaster()

  if (!region) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p>Sie sind nicht berechtigt, Karten auszustellen.</p>
      </div>
    )
  }

  const confirm = async () => {
    try {
      setState(CardActivationState.loading)
      const activationCodes = cardBlueprints.map(cardBlueprint => {
        return cardBlueprint.generateActivationCode()
      })

      await activateCards(client, activationCodes, region)

      const pdfDataUri = await generatePdf(activationCodes, region, projectConfig.pdf)

      downloadDataUri(pdfDataUri, 'ehrenamtskarten.pdf')
      setState(CardActivationState.finished)
    } catch (e) {
      console.error(e)
      appToaster?.show({
        message: 'Etwas ist schiefgegangen beim erstellen der PDF.',
        intent: 'danger',
      })
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
        redo={() => {
          confirm()
        }}
        reset={() => {
          setCardBlueprints([])
          setState(CardActivationState.input)
        }}
      />
    )
  }
}

export default CreateCardsController
