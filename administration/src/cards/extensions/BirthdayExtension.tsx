import { Colors, FormGroup } from '@blueprintjs/core'
import { PartialMessage } from '@bufbuild/protobuf'
import { TextField } from '@mui/material'
import React, { ReactElement } from 'react'

import { CardExtensions } from '../../generated/card_pb'
import PlainDate from '../../util/PlainDate'
import { Extension } from './extensions'

type BirthdayState = { birthday: number }

class BirthdayExtension extends Extension<BirthdayState, null> {
  public readonly name = BirthdayExtension.name

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setInitialState(): void {}

  hasValidBirthdayDate(birthday?: number): boolean {
    if (birthday === undefined) {
      return false
    }
    const date = PlainDate.fromDaysSinceEpoch(birthday)
    const today = PlainDate.fromLocalDate(new Date())
    return !date.isAfter(today)
  }

  createForm(onUpdate: () => void, viewportSmall: boolean): ReactElement {
    const birthdayDate = this.state?.birthday !== undefined ? PlainDate.fromDaysSinceEpoch(this.state.birthday) : ''
    const inputColor = this.state == null ? Colors.GRAY1 : Colors.BLACK
    const formStyle = viewportSmall
      ? { fontSize: 16, padding: '9px 10px', color: inputColor }
      : { fontSize: 14, padding: '6px 10px', color: inputColor }

    return (
      <FormGroup label='Geburtsdatum'>
        <TextField
          fullWidth
          type='date'
          required
          error={!this.isValid()}
          value={birthdayDate.toString()}
          sx={{ '& input[value=""]:not(:focus)': { color: 'transparent' }, '& fieldset': { borderRadius: 0 } }}
          inputProps={{
            max: PlainDate.fromLocalDate(new Date()).toString(),
            style: formStyle,
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
