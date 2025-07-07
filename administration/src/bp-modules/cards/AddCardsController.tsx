import { NonIdealState, Spinner } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Region } from '../../generated/graphql'
import useBlockNavigation from '../../util/useBlockNavigation'
import AddCardsForm from './AddCardsForm'
import GenerationFinished from './CardsCreatedMessage'
import CreateCardsButtonBar from './CreateCardsButtonBar'
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

  if (cardGenerationStep === 'loading') {
    return <Spinner />
  }
  if (cardGenerationStep === 'finished') {
    return (
      <GenerationFinished
        reset={() => {
          setCards([])
          setSearchParams(undefined, { replace: true })
          setCardGenerationStep('input')
        }}
      />
    )
  }

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
}

const AddCardsController = (): ReactElement => {
  const { region } = useWhoAmI().me
  const { t } = useTranslation('cards')

  if (!region) {
    return (
      <NonIdealState
        icon='cross'
        title={t('errors:notAuthorized')}
        description={t('errors:notAuthorizedToCreateCards')}
      />
    )
  }

  return <InnerAddCardsController region={region} />
}

export default AddCardsController
