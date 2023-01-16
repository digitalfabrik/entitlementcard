import React, { ChangeEvent } from 'react'
import { Button, Card, FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import { DateInput } from '@blueprintjs/datetime'
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css'
import styled from 'styled-components'
import { CardBlueprint } from '../../cards/CardBlueprint'
import { add } from 'date-fns'
import { ExtensionHolder } from '../../cards/extensions'

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

const ExtensionForm = (props: { holder: ExtensionHolder<any>; onUpdate: () => void }) => {
  const holder = props.holder

  return holder.extension.createForm(holder.state, state => {
    holder.state = state
    props.onUpdate()
  })
}

const CreateCardForm = (props: Props) => {
  const cardBlueprint = props.cardBlueprint
  console.log(cardBlueprint.hasInfiniteLifetime())
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
            intent={cardBlueprint.isNameValid() ? undefined : Intent.DANGER}
            value={cardBlueprint.fullName}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              cardBlueprint.fullName = event.target.value
              props.onUpdate()
            }}
          />
        </FormGroup>
        <FormGroup label='Ablaufdatum'>
          <DateInput
            placeholder='Ablaufdatum'
            disabled={cardBlueprint.hasInfiniteLifetime()}
            value={cardBlueprint.expirationDate}
            parseDate={str => new Date(str)}
            onChange={value => {
              cardBlueprint.expirationDate = value
              props.onUpdate()
            }}
            formatDate={date => date.toLocaleDateString()}
            maxDate={add(Date.now(), { years: 99 })}
            minDate={new Date()}
            fill={true}
          />
        </FormGroup>
        {cardBlueprint.extensionHolders.map((holder, i) => (
          <ExtensionForm key={i} holder={holder} onUpdate={props.onUpdate} />
        ))}
      </Card>
    </div>
  )
}

export default CreateCardForm
