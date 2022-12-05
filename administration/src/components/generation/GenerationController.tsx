import React, { useContext, useState } from 'react'
import { Spinner } from '@blueprintjs/core'
import { CardBlueprint } from './CardBlueprint'
import GenerationForm from './GenerationForm'
import { useApolloClient } from '@apollo/client'
import { useAppToaster } from '../AppToaster'
import GenerationFinished from './GenerationFinished'
import downloadDataUri from '../../util/downloadDataUri'
import generateCards from './generateCards'
import { RegionContext } from '../../RegionProvider'
import { Exception } from '../../exception'

enum Mode {
  input,
  loading,
  finished,
}

const GenerationController = () => {
  const [cardBlueprints, setCardBlueprints] = useState<CardBlueprint[]>([])
  const client = useApolloClient()
  const region = useContext(RegionContext)
  const [mode, setMode] = useState(Mode.input)
  const appToaster = useAppToaster()

  if (region === null) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p>Sie sind nicht berechtigt, Karten auszustellen.</p>
      </div>
    )
  }

  const confirm = async () => {
    try {
      setMode(Mode.loading)
      const pdfDataUri = await generateCards(client, cardBlueprints, region)
      downloadDataUri(pdfDataUri, 'ehrenamtskarten.pdf')
      setMode(Mode.finished)
    } catch (e) {
      console.error(e)
      if (e instanceof Exception) {
        switch (e.data.type) {
          case 'pdf-generation':
            appToaster?.show({
              message: 'Etwas ist schiefgegangen beim erstellen der PDF.',
              intent: 'danger',
            })
            break
          case 'unicode':
            appToaster?.show({
              message: `Ein Zeichen konnte nicht in der PDF eingebunden werden: ${e.data.unsupportedChar}`,
              intent: 'danger',
            })
            break
        }
      } else {
        appToaster?.show({ message: 'Etwas ist schiefgegangen.', intent: 'danger' })
      }
      setMode(Mode.input)
    }
  }
  if (mode === Mode.input)
    return (
      <GenerationForm
        cardBlueprints={cardBlueprints}
        setCardBlueprints={setCardBlueprints}
        confirm={confirm}
      />
    )
  else if (mode === Mode.loading) return <Spinner />
  // (mode === Mode.finished)
  else
    return (
      <GenerationFinished
        reset={() => {
          setCardBlueprints([])
          setMode(Mode.input)
        }}
      />
    )
}

export default GenerationController
