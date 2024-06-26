import { NonIdealState, Spinner } from '@blueprintjs/core'
import { ReactElement, useCallback, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { WhoAmIContext } from '../../WhoAmIProvider'
import CSVCard from '../../cards/CSVCard'
import { Region } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { ProjectConfig } from '../../project-configs/getProjectConfig'
import useBlockNavigation from '../../util/useBlockNavigation'
import GenerationFinished from './CardsCreatedMessage'
import CreateCardsButtonBar from './CreateCardsButtonBar'
import ImportCardsInput from './ImportCardsInput'
import CardImportTable from './ImportCardsTable'
import useCardGenerator, { CardActivationState } from './hooks/useCardGenerator'

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

export const getHeaders = (projectConfig: ProjectConfig) => [
  projectConfig.card.nameColumnName,
  projectConfig.card.expiryColumnName,
  ...(projectConfig.card.extensionColumnNames.filter(Boolean) as string[]),
]

const InnerImportCardsController = ({ region }: { region: Region }): ReactElement => {
  const { state, setState, generateCardsPdf, generateCardsCsv, setCardBlueprints, cardBlueprints } =
    useCardGenerator(region)
  const projectConfig = useContext(ProjectConfigContext)
  const headers = useMemo(() => getHeaders(projectConfig), [projectConfig])
  const navigate = useNavigate()

  useBlockNavigation({
    when: cardBlueprints.length > 0,
    message: 'Falls Sie fortfahren, werden alle Eingaben verworfen.',
  })

  const goBack = () => {
    if (!cardBlueprints.length) {
      navigate('/cards')
    } else {
      setCardBlueprints([])
    }
  }

  const lineToBlueprint = useCallback(
    (line: string[], csvHeader: string[]): CSVCard => {
      const cardBlueprint = new CSVCard(projectConfig.card, region)
      headers.forEach(header => {
        const idx = csvHeader.indexOf(header)
        if (idx === -1) {
          // column is missing in csv
          return
        }
        cardBlueprint.setValue(header, line[idx])
      })
      return cardBlueprint
    },
    [headers, projectConfig.card, region]
  )

  if (state === CardActivationState.loading) return <Spinner />
  if (state === CardActivationState.finished)
    return (
      <GenerationFinished
        reset={() => {
          setCardBlueprints([])
          setState(CardActivationState.input)
        }}
      />
    )

  return (
    <>
      {cardBlueprints.length === 0 ? (
        <ImportCardsInput setCardBlueprints={setCardBlueprints} lineToBlueprint={lineToBlueprint} headers={headers} />
      ) : (
        <CardImportTable cardBlueprints={cardBlueprints} headers={headers} />
      )}
      <CreateCardsButtonBar
        cardBlueprints={cardBlueprints}
        goBack={goBack}
        generateCardsPdf={() => generateCardsPdf()}
        generateCardsCsv={() => generateCardsCsv()}
      />
    </>
  )
}

export default ImportCardsController
