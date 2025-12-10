import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useBlocker, useNavigate, useSearchParams } from 'react-router'

import { BlockerDialog } from '../../../components/BlockerDialog'
import CenteredCircularProgress from '../../../components/CenteredCircularProgress'
import RenderGuard from '../../../components/RenderGuard'
import { Region, Role } from '../../../generated/graphql'
import { useWhoAmI } from '../../../provider/WhoAmIProvider'
import { CardsCreatedScreen } from '../components/CardsCreatedScreen'
import CreateCardsButtonBar from '../components/CreateCardsButtonBar'
import useCardGenerator from '../hooks/useCardGenerator'
import AddCardsForm from './components/AddCardsForm'

const InnerAddCardsController = ({ region }: { region: Region }) => {
  const navigate = useNavigate()
  const { t } = useTranslation('cards')
  const {
    cardGenerationStep,
    setCardGenerationStep,
    generateCardsPdf,
    generateCardsCsv,
    setCards,
    updateCard,
    cards,
  } = useCardGenerator({ region })
  const [searchParams, setSearchParams] = useSearchParams()

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      currentLocation.pathname !== nextLocation.pathname &&
      cards.length > 0 &&
      cards.some(card => card.fullName.trim().length > 0 || card.expirationDate !== null),
  )

  switch (cardGenerationStep) {
    case 'loading':
      return <CenteredCircularProgress />
    case 'input':
      return (
        <>
          <AddCardsForm
            region={region}
            cards={cards}
            setCards={setCards}
            updateCard={updateCard}
            showAddMoreCardsButton={searchParams.size === 0}
          />
          <CreateCardsButtonBar
            cards={cards}
            goBack={() => navigate('/cards')}
            generateCardsPdf={() => generateCardsPdf()}
            generateCardsCsv={() => generateCardsCsv()}
          />
          <BlockerDialog
            title={t('shared:warningDialogTitle')}
            message={t('dataWillBeLostWarning')}
            blocker={blocker}
          />
        </>
      )
    case 'finished':
      return (
        <CardsCreatedScreen
          onProceed={() => {
            setCards([])
            setSearchParams(undefined, { replace: true })
            setCardGenerationStep('input')
          }}
        />
      )
  }
}

const AddCardsController = (): ReactElement => {
  const { region } = useWhoAmI().me
  const { t } = useTranslation('errors')

  return (
    <RenderGuard
      allowedRoles={[Role.RegionManager, Role.RegionAdmin]}
      condition={region !== undefined}
      error={{ description: t('notAuthorizedToCreateCards') }}
    >
      <InnerAddCardsController region={region!} />
    </RenderGuard>
  )
}

export default AddCardsController
