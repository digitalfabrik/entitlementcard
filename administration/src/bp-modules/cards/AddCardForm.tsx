import { Button, Card as UiCard } from '@blueprintjs/core'
import { FormGroup, Stack } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import {
  MAX_NAME_LENGTH,
  getExpirationDateErrorMessage,
  getFullNameValidationErrorMessage,
  hasInfiniteLifetime,
  isExpirationDateValid,
  isFullNameValid,
} from '../../cards/Card'
import type { Card } from '../../cards/Card'
import { maxCardValidity } from '../../cards/constants'
import CardTextField from '../../cards/extensions/components/CardTextField'
import FormAlert from '../../mui-modules/base/FormAlert'
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
  const [touched, setTouched] = useState(false)
  const [touchedValidationDate, setTouchedValidationDate] = useState(false)
  const showError = !isFullNameValid(card) && touched
  const showValidationDateError = !isExpirationDateValid(card) && touchedValidationDate

  return (
    <UiCard>
      <CardHeader>
        <Button variant='minimal' icon='cross' onClick={() => onRemove()} />
      </CardHeader>
      <Stack key={card.id} sx={{ my: 1, gap: 3 }}>
        <CardTextField
          id='name-input'
          label={t('name')}
          placeholder='Erika Musterfrau'
          autoFocus
          value={card.fullName}
          onChange={fullName => updateCard({ fullName })}
          showError={showError}
          onBlur={() => setTouched(true)}
          inputProps={{
            inputProps: {
              max: MAX_NAME_LENGTH,
            },
          }}
          errorMessage={getFullNameValidationErrorMessage(card.fullName)}
        />
        {!hasInfiniteLifetime(card) && (
          <FormGroup>
            <CustomDatePicker
              onClose={() => setTouchedValidationDate(true)}
              onBlur={() => setTouchedValidationDate(true)}
              label={t('expirationDate')}
              value={card.expirationDate?.toLocalDate() ?? null}
              error={showValidationDateError}
              minDate={today.add({ days: 1 }).toLocalDate()}
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
            {showValidationDateError && (
              <FormAlert severity='error' errorMessage={getExpirationDateErrorMessage(card)} />
            )}
          </FormGroup>
        )}
        <ExtensionForms card={card} updateCard={updateCard} showRequired={false} />
      </Stack>
    </UiCard>
  )
}

export default AddCardForm
