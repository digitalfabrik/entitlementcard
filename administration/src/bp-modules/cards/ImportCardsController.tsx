import { NonIdealState, Spinner } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Region } from '../../generated/graphql'
import useBlockNavigation from '../../util/useBlockNavigation'
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

  useBlockNavigation({
    when: cards.length > 0,
    message: t('dataWillBeLostWarning'),
  })

  const goBack = () => {
    if (!cards.length) {
      navigate('/cards')
    } else {
      setCards([])
    }
  }

  if (cardGenerationStep === 'loading') {
    return <Spinner />
  }

  if (cardGenerationStep === 'finished') {
    return (
      <GenerationFinished
        reset={() => {
          setCards([])
          setCardGenerationStep('input')
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
  const { region } = useWhoAmI().me
  const { t } = useTranslation('errors')
  if (!region) {
    return <NonIdealState icon='cross' title={t('notAuthorized')} description={t('notAuthorizedToCreateCards')} />
  }

  return <InnerImportCardsController region={region} />
}

export default ImportCardsController
