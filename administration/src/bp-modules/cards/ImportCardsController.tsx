import { NonIdealState, Spinner } from '@blueprintjs/core'
import React, { ReactElement, useCallback, useContext, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { FREINET_PARAM } from '../../Router'
import { WhoAmIContext } from '../../WhoAmIProvider'
import { Card, initializeCardFromCSV } from '../../cards/Card'
import { Region } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { ProjectConfig } from '../../project-configs/getProjectConfig'
import useBlockNavigation from '../../util/useBlockNavigation'
import GenerationFinished from './CardsCreatedMessage'
import CreateCardsButtonBar from './CreateCardsButtonBar'
import { convertFreinetImport } from './ImportCardsFromFreinetController'
import ImportCardsInput from './ImportCardsInput'
import CardImportTable from './ImportCardsTable'
import useCardGenerator, { CardActivationState } from './hooks/useCardGenerator'

export const getHeaders = (projectConfig: ProjectConfig): string[] => [
  projectConfig.card.nameColumnName,
  projectConfig.card.expiryColumnName,
  ...(projectConfig.card.extensionColumnNames.filter(Boolean) as string[]),
]

const InnerImportCardsController = ({ region }: { region: Region }): ReactElement => {
  const { state, setState, generateCardsPdf, generateCardsCsv, setCards, cards } = useCardGenerator(region)
  const projectConfig = useContext(ProjectConfigContext)
  const headers = useMemo(() => getHeaders(projectConfig), [projectConfig])
  const navigate = useNavigate()

  const isFreinetFormat = new URLSearchParams(useLocation().search).get(FREINET_PARAM) === 'true'

  useBlockNavigation({
    when: cards.length > 0,
    message: 'Falls Sie fortfahren, werden alle Eingaben verworfen.',
  })

  const goBack = () => {
    if (!cards.length) {
      navigate('/cards')
    } else {
      setCards([])
    }
  }

  // TODO headers or csvHeader?
  const lineToCard = useCallback(
    (line: string[], csvHeader: string[]): Card => {
      if (isFreinetFormat) {
        convertFreinetImport(line, csvHeader, projectConfig)
      }
      return initializeCardFromCSV(projectConfig.card, line, csvHeader, region)
    },
    [projectConfig, region, isFreinetFormat]
  )

  if (state === CardActivationState.loading) {
    return <Spinner />
  }
  if (state === CardActivationState.finished) {
    return (
      <GenerationFinished
        reset={() => {
          setCards([])
          setState(CardActivationState.input)
        }}
      />
    )
  }

  return (
    <>
      {cards.length === 0 ? (
        <ImportCardsInput
          setCards={setCards}
          lineToCard={lineToCard}
          headers={headers}
          isFreinetFormat={isFreinetFormat}
        />
      ) : (
        <CardImportTable cards={cards} cardConfig={projectConfig.card} headers={headers} />
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
  const { region } = useContext(WhoAmIContext).me!
  if (!region) {
    return (
      <NonIdealState
        icon='cross'
        title='Fehlende Berechtigung'
        description='Sie sind nicht berechtigt, Karten auszustellen.'
      />
    )
  }

  return <InnerImportCardsController region={region} />
}

export default ImportCardsController
