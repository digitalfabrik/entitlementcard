import { Button, Icon, Tooltip } from '@blueprintjs/core'
import { useContext, useRef, useState } from 'react'
import FlipMove from 'react-flip-move'
import styled from 'styled-components'

import { CardBlueprint } from '../../cards/CardBlueprint'
import { Region } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import useBlockNavigation from '../../util/useBlockNavigation'
import ButtonBar from '../ButtonBar'
import CreateCardForm from './CreateCardForm'

const FormsWrapper = styled(FlipMove)`
  flex-wrap: wrap;
  flex-grow: 1;
  flex-direction: row;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
`

const AddButton = styled(Button)`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 10px;
  justify-content: center;
  align-items: center;
  transition: 0.2s background;
  background: white;

  :hover {
    background: #f0f0f0;
  }
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

interface Props {
  region: Region
  cardBlueprints: CardBlueprint[]
  setCardBlueprints: (blueprints: CardBlueprint[]) => void
  confirm: () => void
}

const CreateCardsForm = (props: Props) => {
  const { cardBlueprints, setCardBlueprints, region } = props
  const bottomRef = useRef<HTMLDivElement>(null)
  const projectConfig = useContext(ProjectConfigContext)
  const [isModified, setModified] = useState(false)

  const scrollToBottom = () => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  const addForm = () => {
    const cardBlueprint = new CardBlueprint('', region, projectConfig.card)
    setCardBlueprints([...cardBlueprints, cardBlueprint])
    setModified(true)
    scrollToBottom()
  }
  const removeCardBlueprint = (oldBlueprint: CardBlueprint) => {
    setCardBlueprints(cardBlueprints.filter(blueprint => blueprint !== oldBlueprint))
    setModified(true)
  }
  const notifyUpdate = () => {
    setCardBlueprints([...cardBlueprints])
    setModified(true)
  }

  const allCardsValid = cardBlueprints.every(blueprint => blueprint.isValid())

  useBlockNavigation({ when: isModified, message: 'Falls Sie fortfahren, werden alle Eingaben verworfen.' })

  return (
    <>
      <Scrollable>
        <FormsWrapper onFinish={scrollToBottom}>
          {cardBlueprints.map(blueprint => (
            <FormColumn key={blueprint.id}>
              <CreateCardForm
                cardBlueprint={blueprint}
                onRemove={() => removeCardBlueprint(blueprint)}
                onUpdate={() => {
                  notifyUpdate()
                }}
              />
            </FormColumn>
          ))}
          <FormColumn key='AddButton'>
            <AddButton icon={<Icon style={{ margin: 10 }} icon={'add'} iconSize={20} />} onClick={addForm}>
              Karte hinzufügen
            </AddButton>
          </FormColumn>
        </FormsWrapper>
        <div ref={bottomRef} />
      </Scrollable>
      <ButtonBar>
        <Tooltip>
          <Button
            icon='export'
            text='QR-Codes drucken'
            intent='success'
            onClick={props.confirm}
            disabled={!allCardsValid || cardBlueprints.length === 0}
          />
          {!allCardsValid && 'Mindestens eine Karte enthält ungültige Eingaben.'}
          {cardBlueprints.length === 0 && 'Legen Sie zunächst eine Karte an.'}
        </Tooltip>
      </ButtonBar>
    </>
  )
}

export default CreateCardsForm
