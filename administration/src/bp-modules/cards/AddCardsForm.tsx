import React, { ReactElement, useCallback, useContext, useEffect, useRef } from 'react'
import FlipMove from 'react-flip-move'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'

import { Card, initializeCard, initializeCardFromCSV } from '../../cards/Card'
import { Region } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import AddCardForm from './AddCardForm'
import CardFormButton from './CardFormButton'
import { getHeaders } from './ImportCardsController'

const FormsWrapper = styled(FlipMove)`
  flex-wrap: wrap;
  flex-grow: 1;
  flex-direction: row;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`

const Scrollable = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  flex-basis: 0;
  padding: 10px;
  width: 100%;
  overflow: auto;
`

const FormColumn = styled.div`
  width: 400px;
  margin: 10px;
  box-sizing: border-box;
`

type CreateCardsFormProps = {
  region: Region
  cards: Card[]
  setCards: (blueprints: Card[]) => void
  updateCard: (updatedCard: Partial<Card>, index: number) => void
  setApplicationIdToMarkAsProcessed: (applicationIdToMarkAsProcessed: number | undefined) => void
}

const AddCardsForm = ({
  region,
  cards,
  setCards,
  updateCard,
  setApplicationIdToMarkAsProcessed,
}: CreateCardsFormProps): ReactElement => {
  const projectConfig = useContext(ProjectConfigContext)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (cards.length === 0) {
      const headers = getHeaders(projectConfig)
      const values = headers.map(header => searchParams.get(header))
      setCards([initializeCardFromCSV(projectConfig.card, values, headers, region, true)])

      const applicationIdToMarkAsProcessed = searchParams.get('applicationIdToMarkAsProcessed')
      setApplicationIdToMarkAsProcessed(
        applicationIdToMarkAsProcessed == null ? undefined : +applicationIdToMarkAsProcessed
      )

      setSearchParams(undefined, { replace: true })
    }
  }, [cards.length, projectConfig, region, searchParams, setCards, setSearchParams, setApplicationIdToMarkAsProcessed])
  const bottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const addForm = useCallback(() => {
    const card = initializeCard(projectConfig.card, region)
    setCards([...cards, card])
    scrollToBottom()
  }, [cards, projectConfig.card, region, setCards])

  const removeCard = (oldBlueprint: Card) => {
    setCards(cards.filter(blueprint => blueprint !== oldBlueprint))
  }

  return (
    <Scrollable>
      <FormsWrapper
        onFinishAll={() => {
          scrollToBottom()
        }}>
        {cards.map((blueprint, index) => (
          <FormColumn key={blueprint.id}>
            <AddCardForm
              card={blueprint}
              onRemove={() => removeCard(blueprint)}
              updateCard={updatedCard => updateCard(updatedCard, index)}
            />
          </FormColumn>
        ))}
        <FormColumn key='AddButton'>
          <CardFormButton text='Karte hinzufügen' icon='add' onClick={addForm} />
        </FormColumn>
      </FormsWrapper>
      <div ref={bottomRef} />
    </Scrollable>
  )
}

export default AddCardsForm
