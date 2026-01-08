import { AddCard } from '@mui/icons-material'
import { Button, Stack } from '@mui/material'
import type { MotionNodeAnimationOptions } from 'motion/react'
import { AnimatePresence, motion } from 'motion/react'
import React, { ReactElement, useCallback, useContext, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { Card, initializeCard } from '../../../../cards/Card'
import { Region } from '../../../../generated/graphql'
import { ProjectConfigContext } from '../../../../project-configs/ProjectConfigContext'
import AddCardForm from './AddCardForm'

const animationProperties: MotionNodeAnimationOptions = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0 },
  transition: { duration: 0.3 },
}

const AddCardsForm = ({
  region,
  cards,
  setCards,
  showAddMoreCardsButton,
  updateCard,
}: {
  region: Region
  cards: Card[]
  setCards: (cards: Card[]) => void
  showAddMoreCardsButton: boolean
  updateCard: (updatedCard: Partial<Card>, index: number) => void
}): ReactElement => {
  const projectConfig = useContext(ProjectConfigContext)
  const { t } = useTranslation('cards')
  const bottomRef = useRef<HTMLDivElement>(null)
  const [_, setSearchParams] = useSearchParams()

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const addCard = useCallback(() => {
    const card = initializeCard(projectConfig.card, region)
    setCards([...cards, card])
    setTimeout(scrollToBottom, 200)
  }, [cards, projectConfig.card, region, setCards])

  const removeCard = (oldCard: Card) => {
    setCards(cards.filter(card => card !== oldCard))
    setSearchParams(undefined, { replace: true })
  }

  return (
    <Stack
      sx={{ flexGrow: 1, overflow: 'auto', justifyContent: 'safe center', alignItems: 'center' }}
    >
      <Stack
        sx={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
          gap: 2,
        }}
      >
        <AnimatePresence initial={false}>
          {cards.map((card, index) => (
            <motion.div {...animationProperties} key={card.id.toString()}>
              <AddCardForm
                card={card}
                onRemove={() => removeCard(card)}
                updateCard={updatedCard => updateCard(updatedCard, index)}
              />
            </motion.div>
          ))}
          {showAddMoreCardsButton && (
            <Stack
              key='AddButton'
              sx={{
                width: '400px',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button startIcon={<AddCard />} variant='contained' onClick={addCard}>
                {t('addCard')}
              </Button>
            </Stack>
          )}
          <div ref={bottomRef} />
        </AnimatePresence>
      </Stack>
    </Stack>
  )
}

export default AddCardsForm
