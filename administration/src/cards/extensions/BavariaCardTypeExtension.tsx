import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { BavariaCardType as BavariaCardTypeEnum } from '../../generated/card_pb'
import type { Extension, ExtensionComponentProps } from './extensions'

export const BAVARIA_CARD_TYPE_EXTENSION_NAME = 'bavariaCardType'

export const BAVARIA_CARD_TYPE_STANDARD = 'Standard'
const BAVARIA_CARD_TYPE_STANDARD_LEGACY = 'blau'
export const BAVARIA_CARD_TYPE_GOLD = 'Goldkarte'
const BAVARIA_CARD_TYPE_GOLD_LEGACY = 'gold'
type BavariaCardTypeState = typeof BAVARIA_CARD_TYPE_STANDARD | typeof BAVARIA_CARD_TYPE_GOLD
export type BavariaCardTypeExtensionState = { [BAVARIA_CARD_TYPE_EXTENSION_NAME]: BavariaCardTypeState }

const StartDayForm = ({ value, setValue }: ExtensionComponentProps<BavariaCardTypeExtensionState>): ReactElement => {
  const { t } = useTranslation('extensions')

  const items = [BAVARIA_CARD_TYPE_STANDARD, BAVARIA_CARD_TYPE_GOLD]
  return (
    <FormControl>
      <InputLabel id='eak-card-type-select-label'>{t('bavariaCardTypeLabel')}</InputLabel>
      <Select
        size='small'
        labelId='eak-card-type-select-label'
        value={value.bavariaCardType}
        label={t('bavariaCardTypeLabel')}
        onChange={event => {
          const cardType = event.target.value as BavariaCardTypeState
          setValue({ bavariaCardType: cardType })
        }}>
        {items.map(item => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const fromString = (state: string): BavariaCardTypeExtensionState | null => {
  if (state === BAVARIA_CARD_TYPE_STANDARD || state === BAVARIA_CARD_TYPE_STANDARD_LEGACY) {
    return { bavariaCardType: BAVARIA_CARD_TYPE_STANDARD }
  }
  if (state === BAVARIA_CARD_TYPE_GOLD || state === BAVARIA_CARD_TYPE_GOLD_LEGACY) {
    return { bavariaCardType: BAVARIA_CARD_TYPE_GOLD }
  }
  return null
}

const toString = ({ bavariaCardType }: BavariaCardTypeExtensionState): string => bavariaCardType

const BavariaCardTypeExtension: Extension<BavariaCardTypeExtensionState> = {
  name: BAVARIA_CARD_TYPE_EXTENSION_NAME,
  Component: StartDayForm,
  getInitialState: () => ({ bavariaCardType: BAVARIA_CARD_TYPE_STANDARD }),
  causesInfiniteLifetime: state => state.bavariaCardType === BAVARIA_CARD_TYPE_GOLD,
  getProtobufData: state => ({
    extensionBavariaCardType: {
      cardType:
        state.bavariaCardType === BAVARIA_CARD_TYPE_GOLD ? BavariaCardTypeEnum.GOLD : BavariaCardTypeEnum.STANDARD,
    },
  }),
  isValid: state =>
    state?.bavariaCardType === BAVARIA_CARD_TYPE_STANDARD || state?.bavariaCardType === BAVARIA_CARD_TYPE_GOLD,
  fromString,
  toString,
  fromSerialized: fromString,
  serialize: toString,
  isMandatory: true,
}

export default BavariaCardTypeExtension
