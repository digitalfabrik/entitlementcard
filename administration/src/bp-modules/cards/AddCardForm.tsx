import { Button, Card, FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import { TextField } from '@mui/material'
import { add, format, isAfter, isBefore } from 'date-fns'
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

const hasCardExpirationError = (expirationDate: Date): boolean =>
  isBefore(expirationDate, Date.now()) || isAfter(expirationDate, add(Date.now(), { years: 99 }))

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
        <TextField
          fullWidth
          disabled={cardBlueprint.hasInfiniteLifetime()}
          type='date'
          required
          size='small'
          error={cardBlueprint.expirationDate ? hasCardExpirationError(cardBlueprint.expirationDate) : true}
          value={cardBlueprint.expirationDate ? format(cardBlueprint.expirationDate, 'yyyy-MM-dd'): null}
          sx={{ '& input[value=""]:not(:focus)': { color: 'transparent' }, '& fieldset': { borderRadius: 0 } }}
          inputProps={{
            style: { fontSize: 14, padding: '6px 10px' },
            min: format(new Date(), 'yyyy-MM-dd'),
            max: format(add(Date.now(), { years: 99 }), 'yyyy-MM-dd'),
          }}
          onChange={e => {
            if (e.target.value !== null) {
              const millis = Date.parse(e.target.value)
              if (!isNaN(millis)) {
                cardBlueprint.expirationDate = new Date(millis)
                onUpdate()
              }
            }
          }}
        />
      </FormGroup>
      {cardBlueprint.extensions.map((ext, i) => (
        <ExtensionForm key={i} extension={ext} onUpdate={onUpdate} />
      ))}
    </Card>
  )
}

export default CreateCardForm
