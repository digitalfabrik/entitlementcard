import { FormGroup } from '@blueprintjs/core'
import { TextField } from '@mui/material'
import React, { ReactElement } from 'react'

import PlainDate from '../../util/PlainDate'
import { Extension, ExtensionComponentProps } from './extensions'

export const START_DAY_EXTENSION_NAME = 'startDay'
export type StartDayExtensionState = { [START_DAY_EXTENSION_NAME]: number }

// Some minimum start day after 1970 is necessary, as we use an uint32 in the protobuf.
const minStartDay = new PlainDate(2020, 1, 1)

const StartDayForm = ({ value, setValue, isValid }: ExtensionComponentProps<StartDayExtensionState>): ReactElement => {
  const startDayDate = PlainDate.fromDaysSinceEpoch(value.startDay)

  return (
    <FormGroup label='Startdatum'>
      <TextField
        fullWidth
        type='date'
        required
        size='small'
        error={!isValid}
        value={startDayDate.toString()}
        sx={{ '& input[value=""]:not(:focus)': { color: 'transparent' }, '& fieldset': { borderRadius: 0 } }}
        inputProps={{
          min: minStartDay.toString(),
          style: { fontSize: 14, padding: '6px 10px' },
        }}
        onChange={event => {
          const date = PlainDate.safeEpochsFrom(event.target.value)
          if (date !== null) {
            setValue({ startDay: date })
          }
        }}
      />
    </FormGroup>
  )
}

const isStartDayValid = ({ startDay }: StartDayExtensionState): boolean =>
  PlainDate.fromDaysSinceEpoch(startDay).isBefore(minStartDay)

const StartDayExtension: Extension<StartDayExtensionState> = {
  name: START_DAY_EXTENSION_NAME,
  Component: StartDayForm,
  getInitialState: () => ({ startDay: PlainDate.fromLocalDate(new Date()).toDaysSinceEpoch() }),
  causesInfiniteLifetime: () => false,
  getProtobufData: (state: StartDayExtensionState) => ({
    extensionStartDay: {
      startDay: isStartDayValid(state) ? state.startDay : minStartDay.toDaysSinceEpoch(),
    },
  }),
  isValid: isStartDayValid,
  fromString: (value: string) => {
    const startDay = PlainDate.safeEpochsFromCustomFormat(value)
    return startDay === null ? null : { startDay }
  },
  toString: ({ startDay }: StartDayExtensionState) => PlainDate.fromDaysSinceEpoch(startDay).format(),
}

export default StartDayExtension
