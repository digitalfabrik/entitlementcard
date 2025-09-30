import { Clear } from '@mui/icons-material'
import { CardContent, FormGroup, IconButton, Card as MuiCard, Stack } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Card } from '../../cards/Card'
import {
  MAX_NAME_LENGTH,
  getExpirationDateErrorMessage,
  getFullNameValidationErrorMessage,
  hasInfiniteLifetime,
  isExpirationDateValid,
  isFullNameValid,
} from '../../cards/Card'
import { maxCardValidity } from '../../cards/constants'
import CardTextField from '../../cards/extensions/components/CardTextField'
import FormAlert from '../../mui-modules/base/FormAlert'
import PlainDate from '../../util/PlainDate'
import CustomDatePicker from '../components/CustomDatePicker'
import ExtensionForms from './ExtensionForms'

const AddCardForm = ({
  card,
  onRemove,
  updateCard,
}: {
  card: Card
  updateCard: (card: Partial<Card>) => void
  onRemove: () => void
}): ReactElement => {
  const today = PlainDate.fromLocalDate(new Date())
  const { t } = useTranslation('cards')
  const [touchedValidationDate, setTouchedValidationDate] = useState(false)
  const showValidationDateError = !isExpirationDateValid(card) && touchedValidationDate

  return (
    <MuiCard sx={{ width: '400px' }} variant='outlined' key={card.id}>
      <Stack
        sx={{ flexDirection: 'row', borderBottom: '1px solid rgba(16, 22, 26, 0.15)', justifyContent: 'flex-end' }}>
        <IconButton onClick={() => onRemove()} data-testid='remove-card'>
          <Clear />
        </IconButton>
      </Stack>
      <CardContent>
        <Stack sx={{ gap: 2 }}>
          <CardTextField
            id='name-input'
            label={t('name')}
            placeholder='Erika Musterfrau'
            autoFocus
            value={card.fullName}
            onChange={fullName => updateCard({ fullName })}
            showError={!isFullNameValid(card)}
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
      </CardContent>
    </MuiCard>
  )
}

export default AddCardForm
