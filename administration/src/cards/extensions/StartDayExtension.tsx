import { FormGroup } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CustomDatePicker from '../../bp-modules/components/CustomDatePicker'
import FormAlert from '../../bp-modules/self-service/components/FormAlert'
import PlainDate from '../../util/PlainDate'
import type { Extension, ExtensionComponentProps } from './extensions'

export const START_DAY_EXTENSION_NAME = 'startDay'
export type StartDayExtensionState = { [START_DAY_EXTENSION_NAME]: PlainDate | null }

// Some minimum start day after 1970 is necessary, as we use an uint32 in the protobuf.
const minStartDay = new PlainDate(2020, 1, 1)

const StartDayForm = ({ value, setValue, isValid }: ExtensionComponentProps<StartDayExtensionState>): ReactElement => {
  const { t } = useTranslation('extensions')
  const [touched, setTouched] = useState(false)
  const showError = !isValid && touched

  return (
    <FormGroup>
      <CustomDatePicker
        label={t('startDayLabel')}
        onBlur={() => setTouched(true)}
        value={value.startDay?.toLocalDate() ?? null}
        onChange={date => setValue({ startDay: PlainDate.safeFromLocalDate(date) })}
        error={showError}
        minDate={minStartDay.toLocalDate()}
        textFieldSlotProps={{
          sx: {
            '.MuiPickersSectionList-root': {
              padding: '5px 0',
            },
          },
        }}
      />
      {showError && (
        <FormAlert severity='error' errorMessage={t('startDayError', { minStartDay: minStartDay.format() })} />
      )}
    </FormGroup>
  )
}

const isStartDayValid = ({ startDay }: StartDayExtensionState): boolean =>
  startDay ? startDay.isAfter(minStartDay) : false

const StartDayExtension: Extension<StartDayExtensionState> = {
  name: START_DAY_EXTENSION_NAME,
  Component: StartDayForm,
  getInitialState: () => ({ startDay: PlainDate.fromLocalDate(new Date()) }),
  causesInfiniteLifetime: () => false,
  getProtobufData: (state: StartDayExtensionState) => ({
    extensionStartDay: {
      startDay: isStartDayValid(state) ? state.startDay?.toDaysSinceEpoch() : minStartDay.toDaysSinceEpoch(),
    },
  }),
  isValid: isStartDayValid,
  fromString: (value: string) => {
    const startDay = PlainDate.safeFromCustomFormat(value)
    return startDay === null ? null : { startDay }
  },
  toString: ({ startDay }: StartDayExtensionState) => startDay?.format() ?? '',
  fromSerialized: (value: string) => {
    const startDay = PlainDate.safeFrom(value)
    return startDay === null ? null : { startDay }
  },
  serialize: ({ startDay }: StartDayExtensionState) => startDay?.formatISO() ?? '',
  isMandatory: true,
}

export default StartDayExtension
