import { Button, Card, FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import { TextField } from '@mui/material'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { CardBlueprint, hasInfiniteLifetime, isExpirationDateValid, isFullNameValid } from '../../cards/Card'
import PlainDate from '../../util/PlainDate'
import ExtensionForms from './ExtensionForms'

const CardHeader = styled.div`
  margin: -20px -20px 20px -20px;
  padding: 1px;
  border-bottom: 1px solid rgba(16, 22, 26, 0.15);
  display: flex;
  justify-content: right;
`

type CreateCardsFormProps = {
  cardBlueprint: CardBlueprint
  updateCard: (cardBlueprint: Partial<CardBlueprint>) => void
  onRemove: () => void
}

export const maxCardValidity = { years: 99 }

const AddCardForm = ({ cardBlueprint, onRemove, updateCard }: CreateCardsFormProps): ReactElement => {
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
          // If the size of the card is too large, show a warning at the name field as it is the only dynamically sized field
          intent={isFullNameValid(cardBlueprint) ? undefined : Intent.DANGER}
          value={cardBlueprint.fullName}
          onChange={event => updateCard({ fullName: event.target.value })}
        />
      </FormGroup>
      {!hasInfiniteLifetime(cardBlueprint) && (
        <FormGroup label='Ablaufdatum'>
          <TextField
            fullWidth
            type='date'
            required
            size='small'
            error={!isExpirationDateValid(cardBlueprint)}
            value={cardBlueprint.expirationDate?.toString()}
            sx={{ '& input[value=""]:not(:focus)': { color: 'transparent' }, '& fieldset': { borderRadius: 0 } }}
            inputProps={{
              style: { fontSize: 14, padding: '6px 10px' },
              min: today.toString(),
              max: today.add(maxCardValidity).toString(),
            }}
            onChange={event => updateCard({ expirationDate: PlainDate.safeFrom(event.target.value) })}
          />
        </FormGroup>
      )}
      <ExtensionForms cardBlueprint={cardBlueprint} updateCard={updateCard} />
    </Card>
  )
}

export default AddCardForm
