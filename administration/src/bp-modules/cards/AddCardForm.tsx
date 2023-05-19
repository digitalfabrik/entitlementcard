import { Button, Card, FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import { DateInput } from '@blueprintjs/datetime'
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css'
import { add } from 'date-fns'
import React, { ChangeEvent } from 'react'
import styled from 'styled-components'

import { CardBlueprint } from '../../cards/CardBlueprint'
import { ExtensionInstance } from '../../cards/extensions/extensions'

const CardHeader = styled.div`
  margin: -20px -20px 20px -20px;
  padding: 1px;
  border-bottom: 1px solid rgba(16, 22, 26, 0.15);
  display: flex;
  justify-content: right;
`

interface ExtensionFormProps {
  extension: ExtensionInstance
  onUpdate: () => void
}

interface CreateCardsFormProps {
  cardBlueprint: CardBlueprint
  onUpdate: () => void
  onRemove: () => void
}

const ExtensionForm = ({ extension, onUpdate }: ExtensionFormProps) => {
  return extension.createForm(() => {
    onUpdate()
  })
}

const CreateCardForm = ({ cardBlueprint, onRemove, onUpdate }: CreateCardsFormProps) => {
  return (
    <Card>
      <CardHeader>
        <Button minimal icon='cross' onClick={() => onRemove()} />
      </CardHeader>
      <FormGroup label='Name'>
        <InputGroup
          placeholder='Erika Mustermann'
          autoFocus
          //If the size of the card is too large, show a warning at the name field as it is the only dynamically sized field
          intent={cardBlueprint.isFullNameValid() && cardBlueprint.hasValidSize() ? undefined : Intent.DANGER}
          value={cardBlueprint.fullName}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            cardBlueprint.fullName = event.target.value
            onUpdate()
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
            onUpdate()
          }}
          formatDate={date => date.toLocaleDateString()}
          maxDate={add(Date.now(), { years: 99 })}
          minDate={new Date()}
          fill={true}
        />
      </FormGroup>
      {cardBlueprint.extensions.map((ext, i) => (
        <ExtensionForm key={i} extension={ext} onUpdate={onUpdate} />
      ))}
    </Card>
  )
}

export default CreateCardForm
