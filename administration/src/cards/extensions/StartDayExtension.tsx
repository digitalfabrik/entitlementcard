import { FormGroup } from '@blueprintjs/core'
import { PartialMessage } from '@bufbuild/protobuf'
import { TextField } from '@mui/material'

import { CardExtensions } from '../../generated/card_pb'
import PlainDate from '../../util/PlainDate'
import { Extension } from './extensions'

type StartDayState = { startDay: number }

const today = PlainDate.fromLocalDate(new Date())
const initialMinStartDayDate = new PlainDate(today.isoYear, today.isoMonth, today.day)

class StartDayExtension extends Extension<StartDayState, null> {
  public readonly name = StartDayExtension.name

  setInitialState() {
    this.state = { startDay: initialMinStartDayDate.toDaysSinceEpoch() }
  }

  hasValidStartDayDate(startDay?: number): boolean {
    if (startDay === undefined) {
      return false
    }
    const date = PlainDate.fromDaysSinceEpoch(startDay)
    return !date.isBefore(initialMinStartDayDate)
  }

  createForm(onUpdate: () => void) {
    const startDayDate =
      this.state?.startDay !== undefined ? PlainDate.fromDaysSinceEpoch(this.state.startDay) : initialMinStartDayDate

    return (
      <FormGroup label='Startdatum'>
        <TextField
          fullWidth
          type='date'
          required
          size='small'
          error={!this.isValid()}
          value={startDayDate.toString()}
          sx={{ '& input[value=""]:not(:focus)': { color: 'transparent' }, '& fieldset': { borderRadius: 0 } }}
          inputProps={{
            min: initialMinStartDayDate.toString(),
            style: { fontSize: 14, padding: '6px 10px' },
          }}
          onChange={e => {
            if (e.target.value !== null) {
              try {
                const date = PlainDate.from(e.target.value)
                this.state = { startDay: date.toDaysSinceEpoch() }
                onUpdate()
              } catch (error) {
                console.error("Could not parse date from string '" + e.target.value + "'.", error)
              }
            }
          }}
        />
      </FormGroup>
    )
  }

  causesInfiniteLifetime() {
    return false
  }

  setProtobufData(message: PartialMessage<CardExtensions>) {
    message.extensionStartDay = {
      startDay: this.state?.startDay,
    }
  }

  isValid() {
    return this.state !== null && this.hasValidStartDayDate(this.state.startDay)
  }

  /**
   * fromString is only used for the CSV import.
   * The expected format is dd.MM.yyyy
   * @param value The date formatted using dd.MM.yyyy
   */
  fromString(value: string) {
    try {
      const startDay = PlainDate.fromCustomFormat(value, 'dd.MM.yyyy')
      this.state = { startDay: startDay.toDaysSinceEpoch() }
    } catch (e) {
      this.state = null
    }
  }

  toString() {
    return this.state ? PlainDate.fromDaysSinceEpoch(this.state.startDay).format('dd.MM.yyyy') : ''
  }
}

export default StartDayExtension