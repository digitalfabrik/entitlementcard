import { FormGroup } from '@blueprintjs/core'
import { PartialMessage } from '@bufbuild/protobuf'
import { TextField } from '@mui/material'
import React, { ReactElement } from 'react'

import { CardExtensions } from '../../generated/card_pb'
import PlainDate from '../../util/PlainDate'
import { Extension } from './extensions'

type StartDayState = { startDay: number }

const minStartDay = new PlainDate(2020, 1, 1)

class StartDayExtension extends Extension<StartDayState, null> {
  public readonly name = StartDayExtension.name

  setInitialState(): void {
    const today = PlainDate.fromLocalDate(new Date())
    this.state = { startDay: today.toDaysSinceEpoch() }
  }

  /*
    Returns true, if the start day is not before the minimum start day.
    Some minimum start day after 1970 is necessary, as we use an uint32 in the protobuf.
  */
  hasValidStartDayDate(startDay?: number): boolean {
    if (startDay === undefined) {
      return false
    }
    const date = PlainDate.fromDaysSinceEpoch(startDay)
    return !date.isBefore(minStartDay)
  }

  createForm(onUpdate: () => void): ReactElement {
    const startDayDate =
      this.state?.startDay !== undefined
        ? PlainDate.fromDaysSinceEpoch(this.state.startDay)
        : PlainDate.fromLocalDate(new Date())

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
            min: minStartDay.toString(),
            style: { fontSize: 14, padding: '6px 10px' },
          }}
          onChange={e => {
            try {
              const date = PlainDate.from(e.target.value)
              this.state = { startDay: date.toDaysSinceEpoch() }
              onUpdate()
            } catch (error) {
              console.error(`Could not parse date from string '${e.target.value}'.`, error)
            }
          }}
        />
      </FormGroup>
    )
  }

  causesInfiniteLifetime(): boolean {
    return false
  }

  // Returns startDay of the state if it is valid, otherwise minStartDay as placeholder.
  getValidProtobufStartDay(): number {
    const startDay = this.state?.startDay
    if (startDay === undefined || !this.hasValidStartDayDate(startDay)) {
      return minStartDay.toDaysSinceEpoch()
    }
    return startDay
  }

  setProtobufData(message: PartialMessage<CardExtensions>): void {
    message.extensionStartDay = {
      startDay: this.getValidProtobufStartDay(),
    }
  }

  isValid(): boolean {
    return this.state !== null && this.hasValidStartDayDate(this.state.startDay)
  }

  /**
   * fromString is only used for the CSV import.
   * The expected format is dd.MM.yyyy
   * @param value The date formatted using dd.MM.yyyy
   */
  fromString(value: string): void {
    try {
      const startDay = PlainDate.fromCustomFormat(value)
      this.state = { startDay: startDay.toDaysSinceEpoch() }
    } catch {
      this.state = null
    }
  }

  toString(): string {
    return this.state ? PlainDate.fromDaysSinceEpoch(this.state.startDay).format() : ''
  }
}

export default StartDayExtension
