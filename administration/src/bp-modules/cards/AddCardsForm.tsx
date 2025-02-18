import React, { ReactElement, useCallback, useContext, useRef } from 'react'
import FlipMove from 'react-flip-move'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { Card, initializeCard } from '../../cards/Card'
import { Region } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import AddCardForm from './AddCardForm'
import CardFormButton from './CardFormButton'

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
  setCards: (cards: Card[]) => void
  updateCard: (updatedCard: Partial<Card>, index: number) => void
}

const AddCardsForm = ({ region, cards, setCards, updateCard }: CreateCardsFormProps): ReactElement => {
  const projectConfig = useContext(ProjectConfigContext)
  const { t } = useTranslation('cards')
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

  const removeCard = (oldCard: Card) => {
    setCards(cards.filter(card => card !== oldCard))
  }

  return (
    <Scrollable>
      <FormsWrapper
        onFinishAll={() => {
          scrollToBottom()
        }}>
        {cards.map((card, index) => (
          <FormColumn key={card.id}>
            <AddCardForm
              card={card}
              onRemove={() => removeCard(card)}
              updateCard={updatedCard => updateCard(updatedCard, index)}
            />
          </FormColumn>
        ))}
        <FormColumn key='AddButton'>
          <CardFormButton text={t('addCard')} icon='add' onClick={addForm} />
        </FormColumn>
      </FormsWrapper>
      <div ref={bottomRef} />
    </Scrollable>
  )
}

export default AddCardsForm
