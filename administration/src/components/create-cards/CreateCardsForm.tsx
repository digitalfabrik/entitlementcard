import React from 'react'
import CreateCardForm from './CreateCardForm'
import { Button, Card, Tooltip } from '@blueprintjs/core'
import { CardBlueprint, isValid } from '../../cards/CardBlueprint'
import AddEakButton from './AddEakButton'
import styled from 'styled-components'
import FlipMove from 'react-flip-move'
import { add } from 'date-fns'
import { usePrompt } from '../../util/blocker-prompt'
import {BavariaCardType} from "../../cards/BavariaCardType";

let idCounter = 0

const createEmptyCard = (): CardBlueprint => ({
  id: idCounter++,
  forename: '',
  surname: '',
  expirationDate: add(Date.now(), { years: 2 }),
  cardType: BavariaCardType.standard, // FIXME
})

const ButtonBar = styled(({ stickyTop: number, ...rest }) => <Card {...rest} />)<{ stickyTop: number }>`
  width: 100%;
  padding: 15px;
  background: #fafafa;
  position: sticky;
  z-index: 1;
  top: ${props => props.stickyTop}px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  & button {
    margin: 5px;
  }
`

const FormsWrapper = styled(FlipMove)`
  padding: 10px;
  width: 100%;
  z-index: 0;
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
`

const FormColumn = styled.div`
  width: 400px;
  margin: 10px;
  box-sizing: border-box;
`

interface Props {
  cardBlueprints: CardBlueprint[]
  setCardBlueprints: (blueprints: CardBlueprint[]) => void
  confirm: () => void
}

const CreateCardsForm = (props: Props) => {
  const { cardBlueprints, setCardBlueprints } = props
  const addForm = () => setCardBlueprints([...cardBlueprints, createEmptyCard()])
  const updateCardBlueprint = (oldBlueprint: CardBlueprint, newBlueprint: CardBlueprint | null) => {
    if (newBlueprint === null) setCardBlueprints(cardBlueprints.filter(blueprint => blueprint !== oldBlueprint))
    else {
      if (newBlueprint.cardType === BavariaCardType.gold) newBlueprint.expirationDate = null
      setCardBlueprints(cardBlueprints.map(blueprint => (blueprint === oldBlueprint ? newBlueprint : blueprint)))
    }
  }

  const allCardsValid = cardBlueprints.reduce((acc, blueprint) => acc && isValid(blueprint), true)

  usePrompt('Falls Sie fortfahren, werden alle Eingaben verworfen.', cardBlueprints.length !== 0)

  return (
    <>
      <ButtonBar stickyTop={0}>
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
      {/* @ts-ignore */}
      <FormsWrapper>
        {cardBlueprints.map(blueprint => (
          <FormColumn key={blueprint.id}>
            <CreateCardForm
              cardBlueprint={blueprint}
              onUpdate={newBlueprint => updateCardBlueprint(blueprint, newBlueprint)}
            />
          </FormColumn>
        ))}
        <FormColumn key='AddButton'>
          <AddEakButton onClick={addForm} />
        </FormColumn>
      </FormsWrapper>
    </>
  )
}

export default CreateCardsForm
