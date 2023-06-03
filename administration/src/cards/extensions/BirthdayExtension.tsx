import { FormGroup } from '@blueprintjs/core'
import { PartialMessage } from '@bufbuild/protobuf'
import { TextField } from '@mui/material'
import { format, isAfter, isBefore, isValid, parse } from 'date-fns'

import { CardExtensions } from '../../generated/card_pb'
import { dateToDaysSinceEpoch, daysSinceEpochToDate } from '../validityPeriod'
import { Extension } from './extensions'

type BirthdayState = { birthday: number }

const initialBirthdayDate = dateToDaysSinceEpoch(new Date('1980-01-01T00:00+00:00'))
const dateFormat = 'yyyy-MM-dd'
const minBirthday = '1900-01-01'
class BirthdayExtension extends Extension<BirthdayState, null> {
  public readonly name = BirthdayExtension.name

  setInitialState() {
    this.state = { birthday: initialBirthdayDate }
  }
  hasValidBirthdayDate(birthday?: number): boolean {
    if (!birthday) {
      return true
    }
    return (
      isBefore(daysSinceEpochToDate(birthday), new Date(minBirthday)) ||
      isAfter(daysSinceEpochToDate(birthday), new Date())
    )
  }

  createForm(onUpdate: () => void) {
    return (
      <FormGroup label='Geburtsdatum'>
        <TextField
          fullWidth
          type='date'
          required
          size='small'
          error={!this.isValid()}
          value={format(daysSinceEpochToDate(this.state?.birthday ?? initialBirthdayDate), dateFormat)}
          sx={{ '& input[value=""]:not(:focus)': { color: 'transparent' }, '& fieldset': { borderRadius: 0 } }}
          inputProps={{
            max: format(new Date(), dateFormat),
            min: minBirthday,
            style: { fontSize: 14, padding: '6px 10px' },
          }}
          onChange={e => {
            if (e.target.value !== null) {
              const millis = Date.parse(e.target.value)
              if (!isNaN(millis)) {
                this.state = { birthday: dateToDaysSinceEpoch(new Date(e.target.value)) }
                onUpdate()
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
    message.extensionBirthday = {
      birthday: this.state?.birthday,
    }
  }

  isValid() {
    return this.state !== null && !this.hasValidBirthdayDate(this.state.birthday)
  }

  fromString(value: string) {
    const birthday = parse(value, 'dd.MM.yyyy', new Date())
    this.state = isValid(birthday) ? { birthday: dateToDaysSinceEpoch(birthday) } : null
  }
  toString() {
    return this.state ? format(daysSinceEpochToDate(this.state.birthday), 'dd.MM.yyyy') : ''
  }
}

export default BirthdayExtension
