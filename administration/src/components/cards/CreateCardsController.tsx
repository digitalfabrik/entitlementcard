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
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { CodeType, Region } from '../../generated/graphql'
import { generatePdf } from '../../cards/PdfFactory'

enum CardActivationState {
  input,
  loading,
  finished,
}

const CreateCardsController = () => {
  const { region } = useContext(WhoAmIContext).me!

  if (!region) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p>Sie sind nicht berechtigt, Karten auszustellen.</p>
      </div>
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

      const activationCodes = cardBlueprints.map(cardBlueprint => {
        return cardBlueprint.generateActivationCode()
      })
      const staticCodes = projectConfig.staticQrCodesEnabled
        ? cardBlueprints.map(cardBlueprints => {
            return cardBlueprints.generateStaticVerificationCode()
          })
        : null

      const pdfDataUri = await generatePdf(activationCodes, staticCodes, region, projectConfig.pdf)

      await activateCards(client, activationCodes, region, CodeType.Dynamic)

      if (staticCodes) await activateCards(client, staticCodes, region, CodeType.Static)

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
        reset={() => {
          setCardBlueprints([])
          setState(CardActivationState.input)
        }}
      />
    )
  }
}

export default CreateCardsController
