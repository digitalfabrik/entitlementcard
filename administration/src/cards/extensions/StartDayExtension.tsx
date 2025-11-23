import { FormGroup } from '@mui/material'
import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Temporal } from 'temporal-polyfill'

import CustomDatePicker from '../../components/CustomDatePicker'
import FormAlert from '../../components/FormAlert'
import {
  formatDateDefaultGerman,
  plainDateToDaysSinceEpoch,
  safeParseGermanPlainDateString,
  safeParseIsoPlainDate,
} from '../../util/date'
import { isExceedingMaxValidityDate } from '../../util/helper'
import { maxCardValidity } from '../constants'
import type { Extension, ExtensionComponentProps } from './extensions'

export const START_DAY_EXTENSION_NAME = 'startDay'
export type StartDayExtensionState = { [START_DAY_EXTENSION_NAME]: Temporal.PlainDate | null }

// Some minimum start day after 1970 is necessary, as we use an uint32 in the protobuf.
// We also have to provide some minStartDay in the past for csv cards imports that may contain startDay in the past.
export const minStartDay = Temporal.Now.plainDateISO().subtract({ years: 5 })

const StartDayForm = ({
  value,
  setValue,
  isValid,
}: ExtensionComponentProps<StartDayExtensionState>): ReactElement => {
  const { t } = useTranslation('extensions')
  const [interacted, setInteracted] = useState(false)
  const showError = !isValid && interacted

  const getStartDayErrorMessage = (): string | null => {
    const startDay = value.startDay

    if (!startDay) {
      return t('startDayError')
    }
    if (Temporal.PlainDate.compare(startDay, minStartDay) < 0) {
      return t('startDayPastError', { minStartDay })
    }
    if (isExceedingMaxValidityDate(startDay)) {
      return t('startDayFutureError', {
        maxValidationDate: Temporal.Now.plainDateISO().add(maxCardValidity),
      })
    }
    return null
  }

  return (
    <FormGroup>
      <CustomDatePicker
        label={t('startDayLabel')}
        onBlur={() => setInteracted(true)}
        onClose={() => setInteracted(true)}
        value={value.startDay}
        onChange={date => setValue({ startDay: date })}
        error={showError}
        minDate={minStartDay}
        textFieldSlotProps={{
          sx: {
            '.MuiPickersSectionList-root': {
              padding: '5px 0',
            },
          },
        }}
      />
      {showError && <FormAlert severity='error' errorMessage={getStartDayErrorMessage()} />}
    </FormGroup>
  )
}

const isStartDayValid = ({ startDay }: StartDayExtensionState): boolean =>
  startDay
    ? Temporal.PlainDate.compare(startDay, minStartDay) >= 0 &&
      !isExceedingMaxValidityDate(startDay)
    : false

const StartDayExtension: Extension<StartDayExtensionState> = {
  name: START_DAY_EXTENSION_NAME,
  Component: StartDayForm,
  getInitialState: () => ({ startDay: Temporal.Now.plainDateISO() }),
  causesInfiniteLifetime: () => false,
  getProtobufData: (state: StartDayExtensionState) => ({
    extensionStartDay: {
      startDay: isStartDayValid(state)
        ? plainDateToDaysSinceEpoch(state.startDay!)
        : plainDateToDaysSinceEpoch(minStartDay),
    },
  }),
  isValid: isStartDayValid,
  fromString: (value: string) => {
    const startDay = safeParseGermanPlainDateString(value)
    return startDay === null ? null : { startDay }
  },
  toString: ({ startDay }: StartDayExtensionState) =>
    startDay !== null ? formatDateDefaultGerman(startDay) : '',
  fromSerialized: (value: string) => {
    const startDay = safeParseIsoPlainDate(value)
    return startDay === null ? null : { startDay }
  },
  serialize: ({ startDay }: StartDayExtensionState) => startDay?.toString() ?? '',
  isMandatory: true,
}

export default StartDayExtension
