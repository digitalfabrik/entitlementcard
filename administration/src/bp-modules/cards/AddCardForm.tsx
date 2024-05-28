import { Button, Card, FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import { TextField } from '@mui/material'
import React, { ChangeEvent } from 'react'
import styled from 'styled-components'

import { CardBlueprint } from '../../cards/CardBlueprint'
import { ExtensionInstance } from '../../cards/extensions/extensions'
import PlainDate from '../../util/PlainDate'

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

export const maxCardValidity = { years: 99 }
const ExtensionForm = ({ extension, onUpdate }: ExtensionFormProps) => {
  return extension.createForm(() => {
    onUpdate()
  })
}

const CreateCardForm = ({ cardBlueprint, onRemove, onUpdate }: CreateCardsFormProps) => {
  const today = PlainDate.fromLocalDate(new Date())
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
          intent={cardBlueprint.isFullNameValid() ? undefined : Intent.DANGER}
          value={cardBlueprint.fullName}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            cardBlueprint.fullName = event.target.value
            onUpdate()
          }}
        />
      </FormGroup>
      {!cardBlueprint.hasInfiniteLifetime() && (
        <FormGroup label='Ablaufdatum'>
          <TextField
            fullWidth
            disabled={cardBlueprint.hasInfiniteLifetime()}
            type='date'
            required
            size='small'
            error={!cardBlueprint.isExpirationDateValid()}
            value={cardBlueprint.expirationDate ? cardBlueprint.expirationDate.toString() : null}
            sx={{ '& input[value=""]:not(:focus)': { color: 'transparent' }, '& fieldset': { borderRadius: 0 } }}
            inputProps={{
              style: { fontSize: 14, padding: '6px 10px' },
              min: today.toString(),
              max: today.add(maxCardValidity).toString(),
            }}
            onChange={e => {
              if (e.target.value !== null) {
                try {
                  cardBlueprint.expirationDate = PlainDate.from(e.target.value)
                  onUpdate()
                } catch (error) {
                  console.error(`Could not parse date from string '${e.target.value}'.`, error)
                }
              }
            }}
          />
        </FormGroup>
      )}
      {cardBlueprint.extensions.map((ext, i) => (
        <ExtensionForm key={i} extension={ext} onUpdate={onUpdate} />
      ))}
    </Card>
  )
}

export default CreateCardForm
