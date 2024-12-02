import { NonIdealState, Spinner } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { WhoAmIContext } from '../../WhoAmIProvider'
import { Region } from '../../generated/graphql'
import useBlockNavigation from '../../util/useBlockNavigation'
import GenerationFinished from './CardsCreatedMessage'
import CreateCardsButtonBar from './CreateCardsButtonBar'
import ImportCardsInput from './ImportCardsInput'
import CardImportTable from './ImportCardsTable'
import useCardGenerator, { CardActivationState } from './hooks/useCardGenerator'

const InnerImportCardsController = ({ region }: { region: Region }): ReactElement => {
  const { state, setState, generateCardsPdf, generateCardsCsv, setCards, cards } = useCardGenerator(region)
  const navigate = useNavigate()

  useBlockNavigation({
    when: cards.length > 0,
    message: 'Falls Sie fortfahren, werden alle Eingaben verworfen.',
  })

  const goBack = () => {
    if (!cards.length) {
      navigate('/cards')
    } else {
      setCards([])
    }
  }

  if (state === CardActivationState.loading) {
    return <Spinner />
  }

  if (state === CardActivationState.finished) {
    return (
      <GenerationFinished
        reset={() => {
          setCards([])
          setState(CardActivationState.input)
        }}
      />
    )
  }

  return (
    <>
      {cards.length === 0 ? (
        <ImportCardsInput setCards={setCards} region={region} />
      ) : (
        <CardImportTable cards={cards} />
      )}
      <CreateCardsButtonBar
        cards={cards}
        goBack={goBack}
        generateCardsPdf={() => generateCardsPdf()}
        generateCardsCsv={() => generateCardsCsv()}
      />
    </>
  )
}

const ImportCardsController = (): ReactElement => {
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

  return <InnerImportCardsController region={region} />
}

export default ImportCardsController
