import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Region, Role } from '../../generated/graphql'
import CenteredCircularProgress from '../../mui-modules/base/CenteredCircularProgress'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import useBlockNavigation from '../../util/useBlockNavigation'
import AddCardsForm from './AddCardsForm'
import CreateCardsButtonBar from './CreateCardsButtonBar'
import { CardsCreatedScreen } from './components/CardsCreatedScreen'
import useCardGenerator from './hooks/useCardGenerator'

const InnerAddCardsController = ({ region }: { region: Region }) => {
  const navigate = useNavigate()
  const { t } = useTranslation('cards')
  const { cardGenerationStep, setCardGenerationStep, generateCardsPdf, generateCardsCsv, setCards, updateCard, cards } =
    useCardGenerator({ region })
  const [searchParams, setSearchParams] = useSearchParams()

  useBlockNavigation({
    when: cards.length > 0,
    message: t('dataWillBeLostWarning'),
  })

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
      error={{ description: t('notAuthorizedToCreateCards') }}>
      <InnerAddCardsController region={region!} />
    </RenderGuard>
  )
}

export default AddCardsController
