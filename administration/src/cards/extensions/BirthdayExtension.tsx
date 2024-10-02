import { FormGroup } from '@blueprintjs/core'
import { PartialMessage } from '@bufbuild/protobuf'
import { TextField } from '@mui/material'
import React, { ReactElement } from 'react'

import { CardExtensions } from '../../generated/card_pb'
import PlainDate from '../../util/PlainDate'
import { Extension } from './extensions'

type BirthdayState = { birthday: number }

const initialBirthdayDate = new PlainDate(1980, 1, 1)
const minBirthday = new PlainDate(1900, 1, 1)

class BirthdayExtension extends Extension<BirthdayState, null> {
  public readonly name = BirthdayExtension.name

  setInitialState(): void {
    this.state = { birthday: initialBirthdayDate.toDaysSinceEpoch() }
  }

  hasValidBirthdayDate(birthday?: number): boolean {
    if (birthday === undefined) {
      return false
    }
    const date = PlainDate.fromDaysSinceEpoch(birthday)
    const today = PlainDate.fromLocalDate(new Date())
    return !date.isBefore(minBirthday) && !date.isAfter(today)
  }

  createForm(onUpdate: () => void): ReactElement {
    const birthdayDate =
      this.state?.birthday !== undefined ? PlainDate.fromDaysSinceEpoch(this.state.birthday) : initialBirthdayDate

    return (
      <FormGroup label='Geburtsdatum'>
        <TextField
          fullWidth
          type='date'
          required
          size='small'
          error={!this.isValid()}
          value={birthdayDate.toString()}
          sx={{ '& input[value=""]:not(:focus)': { color: 'transparent' }, '& fieldset': { borderRadius: 0 } }}
          inputProps={{
            max: PlainDate.fromLocalDate(new Date()).toString(),
            min: minBirthday.toString(),
            style: { fontSize: 14, padding: '6px 10px' },
          }}
          onChange={e => {
            try {
              const date = PlainDate.from(e.target.value)
              this.state = { birthday: date.toDaysSinceEpoch() }
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

  setProtobufData(message: PartialMessage<CardExtensions>): void {
    // eslint-disable-next-line no-param-reassign
    message.extensionBirthday = {
      birthday: this.state?.birthday,
    }
  }

  isValid(): boolean {
    return this.state !== null && this.hasValidBirthdayDate(this.state.birthday)
  }

  /**
   * fromString is only used for the CSV import.
   * The expected format is dd.MM.yyyy
   * @param value The date formatted using dd.MM.yyyy
   */
  fromString(value: string): void {
    try {
      const birthday = PlainDate.fromCustomFormat(value)
      this.state = { birthday: birthday.toDaysSinceEpoch() }
    } catch {
      this.state = null
    }
  }

  toString(): string {
    return this.state ? PlainDate.fromDaysSinceEpoch(this.state.birthday).format() : ''
  }
}

export default BirthdayExtension
