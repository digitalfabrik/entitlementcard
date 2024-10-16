import { Button, Card, FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import { TextField } from '@mui/material'
import React, { ChangeEvent, JSXElementConstructor, ReactElement } from 'react'
import styled from 'styled-components'

import { CardBlueprint } from '../../cards/CardBlueprint'
import { ExtensionInstance } from '../../cards/extensions/extensions'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import PlainDate from '../../util/PlainDate'

const CardHeader = styled.div`
  margin: -20px -20px 20px -20px;
  padding: 1px;
  border-bottom: 1px solid rgba(16, 22, 26, 0.15);
  display: flex;
  justify-content: right;
`

type ExtensionFormProps = {
  extension: ExtensionInstance
  onUpdate: () => void
  viewportSmall: boolean
}

type CreateCardsFormProps = {
  cardBlueprint: CardBlueprint
  onUpdate: () => void
  onRemove: () => void
}

export const maxCardValidity = { years: 99 }
export const ExtensionForm = ({
  extension,
  onUpdate,
  viewportSmall,
}: ExtensionFormProps): ReactElement<ExtensionInstance, string | JSXElementConstructor<ExtensionInstance>> | null =>
  extension.createForm(() => {
    onUpdate()
  }, viewportSmall)

const AddCardForm = ({ cardBlueprint, onRemove, onUpdate }: CreateCardsFormProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
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
              try {
                cardBlueprint.expirationDate = PlainDate.from(e.target.value)
                onUpdate()
              } catch (error) {
                console.error(`Could not parse date from string '${e.target.value}'.`, error)
              }
            }}
          />
        </FormGroup>
      )}
      {cardBlueprint.extensions.map(extension => (
        <ExtensionForm key={extension.name} extension={extension} onUpdate={onUpdate} viewportSmall={viewportSmall} />
      ))}
    </Card>
  )
}

export default AddCardForm
