import { AnimatePresence, motion } from 'motion/react'
import type { MotionNodeAnimationOptions } from 'motion/react'
import React, { ReactElement, useCallback, useContext, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import styled from 'styled-components'

import { Card, initializeCard } from '../../cards/Card'
import { Region } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import AddCardForm from './AddCardForm'
import CardFormButton from './CardFormButton'

const FormsWrapper = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fill, 400px);
  justify-content: center;
  justify-items: flex-start;
  align-items: flex-start;
`

const Scrollable = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  flex-basis: 0;
  padding: 24px;
  overflow: auto;
`

const FormColumn = styled.div`
  width: 400px;
  box-sizing: border-box;
`

const animationProperties: MotionNodeAnimationOptions = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0 },
  transition: { duration: 0.3 },
}

type CreateCardsFormProps = {
  region: Region
  cards: Card[]
  setCards: (cards: Card[]) => void
  showAddMoreCardsButton: boolean
  updateCard: (updatedCard: Partial<Card>, index: number) => void
}

const AddCardsForm = ({
  region,
  cards,
  setCards,
  showAddMoreCardsButton,
  updateCard,
}: CreateCardsFormProps): ReactElement => {
  const projectConfig = useContext(ProjectConfigContext)
  const { t } = useTranslation('cards')
  const bottomRef = useRef<HTMLDivElement>(null)
  const [_, setSearchParams] = useSearchParams()

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const addForm = useCallback(() => {
    const card = initializeCard(projectConfig.card, region)
    setCards([...cards, card])
    setTimeout(scrollToBottom, 200)
  }, [cards, projectConfig.card, region, setCards])

  const removeCard = (oldCard: Card) => {
    setCards(cards.filter(card => card !== oldCard))
    setSearchParams(undefined, { replace: true })
  }

  return (
    <Scrollable>
      <FormsWrapper>
        <AnimatePresence initial={false}>
          {cards.map((card, index) => (
            <motion.div {...animationProperties} key={card.id.toString()}>
              <FormColumn>
                <AddCardForm
                  card={card}
                  onRemove={() => removeCard(card)}
                  updateCard={updatedCard => updateCard(updatedCard, index)}
                />
              </FormColumn>
            </motion.div>
          ))}
          {showAddMoreCardsButton && (
            <FormColumn key='AddButton'>
              <CardFormButton text={t('addCard')} icon='add' onClick={addForm} />
            </FormColumn>
          )}
          <div ref={bottomRef} />
        </AnimatePresence>
      </FormsWrapper>
    </Scrollable>
  )
}

export default AddCardsForm
