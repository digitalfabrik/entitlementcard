import { Button, FormGroup, InputGroup, Intent, Card as UiCard } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { hasInfiniteLifetime, isExpirationDateValid, isFullNameValid } from '../../cards/Card'
import type { Card } from '../../cards/Card'
import { maxCardValidity } from '../../cards/constants'
import PlainDate from '../../util/PlainDate'
import CustomDatePicker from '../components/CustomDatePicker'
import ExtensionForms from './ExtensionForms'

const CardHeader = styled.div`
  margin: -20px -20px 20px -20px;
  padding: 1px;
  border-bottom: 1px solid rgba(16, 22, 26, 0.15);
  display: flex;
  justify-content: right;
`

type CreateCardsFormProps = {
  card: Card
  updateCard: (card: Partial<Card>) => void
  onRemove: () => void
}

const AddCardForm = ({ card, onRemove, updateCard }: CreateCardsFormProps): ReactElement => {
  const today = PlainDate.fromLocalDate(new Date())
  const { t } = useTranslation('cards')

  return (
    <UiCard>
      <CardHeader>
        <Button minimal icon='cross' onClick={() => onRemove()} />
      </CardHeader>
      <FormGroup label={t('name')}>
        <InputGroup
          placeholder='Erika Mustermann'
          autoFocus
          // If the size of the card is too large, show a warning at the name field as it is the only dynamically sized field
          intent={isFullNameValid(card) ? undefined : Intent.DANGER}
          value={card.fullName}
          onChange={event => updateCard({ fullName: event.target.value })}
        />
      </FormGroup>
      {!hasInfiniteLifetime(card) && (
        <FormGroup label={t('expirationDate')}>
          <CustomDatePicker
            value={card.expirationDate?.toLocalDate() ?? null}
            error={!isExpirationDateValid(card)}
            minDate={today.toLocalDate()}
            maxDate={today.add(maxCardValidity).toLocalDate()}
            onChange={date => {
              updateCard({ expirationDate: PlainDate.safeFromLocalDate(date) })
            }}
            textFieldSlotProps={{
              sx: {
                '.MuiPickersSectionList-root': {
                  padding: '5px 0',
                },
              },
            }}
          />
        </FormGroup>
      )}
      <ExtensionForms card={card} updateCard={updateCard} showRequired />
    </UiCard>
  )
}

export default AddCardForm
