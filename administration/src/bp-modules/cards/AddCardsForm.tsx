import React, { ReactElement, useCallback, useContext, useEffect, useRef } from 'react'
import FlipMove from 'react-flip-move'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'

import { CardBlueprint } from '../../cards/CardBlueprint'
import { Region } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import AddCardForm from './AddCardForm'
import CardFormButton from './CardFormButton'
import { getHeaders } from './ImportCardsController'

const FormsWrapper = styled(FlipMove)`
  flex-wrap: wrap;
  flex-grow: 1;
  flex-direction: row;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`

const Scrollable = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  flex-basis: 0;
  padding: 10px;
  width: 100%;
  overflow: auto;
`

const FormColumn = styled.div`
  width: 400px;
  margin: 10px;
  box-sizing: border-box;
`

type CreateCardsFormProps = {
  region: Region
  cardBlueprints: CardBlueprint[]
  setCardBlueprints: (blueprints: CardBlueprint[]) => void
  setApplicationIdToMarkAsProcessed: (applicationIdToMarkAsProcessed: number | undefined) => void
}

const AddCardsForm = ({
  region,
  cardBlueprints,
  setCardBlueprints,
  setApplicationIdToMarkAsProcessed,
}: CreateCardsFormProps): ReactElement => {
  const projectConfig = useContext(ProjectConfigContext)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (cardBlueprints.length === 0) {
      const headers = getHeaders(projectConfig)
      const cardBlueprint = new CardBlueprint('', projectConfig.card, [region])
      headers.forEach(header => {
        const value = searchParams.get(header)
        if (!value) {
          return
        }
        cardBlueprint.setValue(header, value)
      })
      setCardBlueprints([cardBlueprint])

      const applicationIdToMarkAsProcessed = searchParams.get('applicationIdToMarkAsProcessed')
      setApplicationIdToMarkAsProcessed(
        applicationIdToMarkAsProcessed == null ? undefined : +applicationIdToMarkAsProcessed
      )

      setSearchParams(undefined, { replace: true })
    }
  }, [
    cardBlueprints.length,
    projectConfig,
    region,
    searchParams,
    setCardBlueprints,
    setSearchParams,
    setApplicationIdToMarkAsProcessed,
  ])
  const bottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const addForm = useCallback(() => {
    const cardBlueprint = new CardBlueprint('', projectConfig.card, [region])
    setCardBlueprints([...cardBlueprints, cardBlueprint])
    scrollToBottom()
  }, [cardBlueprints, projectConfig.card, region, setCardBlueprints])

  const removeCardBlueprint = (oldBlueprint: CardBlueprint) => {
    setCardBlueprints(cardBlueprints.filter(blueprint => blueprint !== oldBlueprint))
  }

  const notifyUpdate = () => {
    setCardBlueprints([...cardBlueprints])
  }

  return (
    <Scrollable>
      <FormsWrapper
        onFinishAll={() => {
          scrollToBottom()
        }}>
        {cardBlueprints.map(blueprint => (
          <FormColumn key={blueprint.id}>
            <AddCardForm
              cardBlueprint={blueprint}
              onRemove={() => removeCardBlueprint(blueprint)}
              onUpdate={notifyUpdate}
            />
          </FormColumn>
        ))}
        <FormColumn key='AddButton'>
          <CardFormButton text='Karte hinzufügen' icon='add' onClick={addForm} />
        </FormColumn>
      </FormsWrapper>
      <div ref={bottomRef} />
    </Scrollable>
  )
}

export default AddCardsForm
