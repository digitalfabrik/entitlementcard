import React, { ChangeEvent } from 'react'
import { Button, Card, FormGroup, InputGroup, MenuItem } from '@blueprintjs/core'
import { ItemRenderer, Select } from '@blueprintjs/select'
import { DateInput } from '@blueprintjs/datetime'
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css'
import styled from 'styled-components'
import { CardBlueprint } from '../../cards/CardBlueprint'
import { add } from 'date-fns'

const CardHeader = styled.div`
  margin: -20px -20px 20px -20px;
  padding: 1px;
  border-bottom: 1px solid rgba(16, 22, 26, 0.15);
  display: flex;
  justify-content: right;
`

interface Props {
  cardBlueprint: CardBlueprint
  onUpdate: () => void
  onRemove: () => void
}

const CreateCardForm = (props: Props) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <Button minimal icon='cross' onClick={() => props.onRemove()} />
        </CardHeader>
        <FormGroup label='Name'>
          <InputGroup
            placeholder='Erika Mustermann'
            autoFocus
            value={props.cardBlueprint.fullName}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              props.cardBlueprint.fullName = event.target.value
              props.onUpdate()
            }}
          />
        </FormGroup>
        <FormGroup label='Ablaufdatum'>
          <DateInput
            placeholder='Ablaufdatum'
            // TODO: disabled={props.cardBlueprint.cardType === BavariaCardTypeBlueprint.gold}
            value={props.cardBlueprint.expirationDate}
            parseDate={str => new Date(str)}
            onChange={value => {
              props.cardBlueprint.expirationDate = value
              props.onUpdate()
            }}
            formatDate={date => date.toLocaleDateString()}
            maxDate={add(Date.now(), { years: 99 })}
            minDate={new Date()}
            fill={true}
          />
        </FormGroup>
      </Card>
    </div>
  )
}

export default CreateCardForm
