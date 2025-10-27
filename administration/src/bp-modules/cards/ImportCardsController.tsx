import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useBlocker, useNavigate } from 'react-router'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Region, Role } from '../../generated/graphql'
import CenteredCircularProgress from '../../mui-modules/base/CenteredCircularProgress'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import { BlockerDialog } from '../../shared/components/BlockerDialog'
import GenerationFinished from './CardsCreatedMessage'
import CreateCardsButtonBar from './CreateCardsButtonBar'
import ImportCardsInput from './ImportCardsInput'
import CardImportTable from './ImportCardsTable'
import useCardGenerator from './hooks/useCardGenerator'

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
    case 'finished':
      return (
        <GenerationFinished
          reset={() => {
            setCards([])
            setCardGenerationStep('input')
          }}
        />
      )
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
