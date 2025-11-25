import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useBlocker, useNavigate } from 'react-router'

import { BlockerDialog } from '../../../components/BlockerDialog'
import CenteredCircularProgress from '../../../components/CenteredCircularProgress'
import RenderGuard from '../../../components/RenderGuard'
import { Region, Role } from '../../../generated/graphql'
import { useWhoAmI } from '../../../provider/WhoAmIProvider'
import { CardsCreatedScreen } from '../components/CardsCreatedScreen'
import CreateCardsButtonBar from '../components/CreateCardsButtonBar'
import useCardGenerator from '../hooks/useCardGenerator'
import ImportCardsInput from './components/ImportCardsInput'
import CardImportTable from './components/ImportCardsTable'

const InnerImportCardsController = ({ region }: { region: Region }): ReactElement => {
  const { cardGenerationStep, setCardGenerationStep, generateCardsPdf, generateCardsCsv, setCards, cards } =
    useCardGenerator({ region, initializeCards: false })
  const navigate = useNavigate()
  const { t } = useTranslation('cards')

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => currentLocation.pathname !== nextLocation.pathname && cards.length > 0
  )

  const goBack = () => {
    if (!cards.length) {
      navigate('/cards')
    } else {
      setCards([])
    }
  }

  switch (cardGenerationStep) {
    case 'loading':
      return <CenteredCircularProgress />
    case 'input':
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
            setCardGenerationStep('input')
          }}
        />
      )
  }
}

const ImportCardsController = (): ReactElement => {
  const { region } = useWhoAmI().me
  const { t } = useTranslation('errors')

  return (
    <RenderGuard
      allowedRoles={[Role.RegionManager, Role.RegionAdmin]}
      condition={region !== undefined}
      error={{ description: t('notAuthorizedToCreateCards') }}>
      <InnerImportCardsController region={region!} />
    </RenderGuard>
  )
}

export default ImportCardsController
