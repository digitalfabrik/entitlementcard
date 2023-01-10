import React, { ChangeEvent } from 'react'
import { Button, Card, FormGroup, InputGroup, MenuItem } from '@blueprintjs/core'
import { ItemRenderer, Select } from '@blueprintjs/select'
import { DateInput } from '@blueprintjs/datetime'
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css'
import styled from 'styled-components'
import {BavariaCardTypeBlueprint, CardBlueprint} from '../../cards/CardBlueprint'
import { add } from 'date-fns'

const CardHeader = styled.div`
  margin: -20px -20px 20px -20px;
  padding: 1px;
  border-bottom: 1px solid rgba(16, 22, 26, 0.15);
  display: flex;
  justify-content: right;
`

const CardTypeSelect = Select.ofType<BavariaCardTypeBlueprint>()

const renderCardType: ItemRenderer<BavariaCardTypeBlueprint> = (cardType, { handleClick, modifiers }) => {
  if (!modifiers.matchesPredicate) {
    return null
  }
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={cardType}
      key={cardType}
      onClick={handleClick}
    />
  )
}

interface Props {
  cardBlueprint: CardBlueprint
  onUpdate: (newCardBlueprint: CardBlueprint | null) => void
}

const CreateCardForm = (props: Props) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <Button minimal icon='cross' onClick={() => props.onUpdate(null)} />
        </CardHeader>
        <FormGroup label='Name'>
          <InputGroup
            placeholder='Erika Mustermann'
            autoFocus
            value={props.cardBlueprint.name}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              props.onUpdate({
                ...props.cardBlueprint,
                name: event.target.value,
              })
            }
          />
        </FormGroup>
        <FormGroup label='Ablaufdatum'>
          <DateInput
            placeholder='Ablaufdatum'
            disabled={props.cardBlueprint.cardType === BavariaCardTypeBlueprint.gold}
            value={props.cardBlueprint.expirationDate}
            parseDate={str => new Date(str)}
            onChange={value => props.onUpdate({ ...props.cardBlueprint, expirationDate: value })}
            formatDate={date => date.toLocaleDateString()}
            maxDate={add(Date.now(), { years: 99 })}
            minDate={new Date()}
            fill={true}
          />
        </FormGroup>
        <FormGroup label='Typ der Karte'>
          <CardTypeSelect
            items={Object.values(BavariaCardTypeBlueprint)}
            onItemSelect={value => props.onUpdate({ ...props.cardBlueprint, cardType: value })}
            itemRenderer={renderCardType}
            filterable={false}>
            <Button text={props.cardBlueprint.cardType} rightIcon='caret-down' />
          </CardTypeSelect>
        </FormGroup>
      </Card>
    </div>
  )
}

export default CreateCardForm
