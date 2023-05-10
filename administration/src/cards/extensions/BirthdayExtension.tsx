import { FormGroup } from '@blueprintjs/core'
import { DateInput } from '@blueprintjs/datetime'
import { PartialMessage } from '@bufbuild/protobuf'
import { sub } from 'date-fns'

import { CardExtensions } from '../../generated/card_pb'
import { dateToDaysSinceEpoch, daysSinceEpochToDate } from '../validityPeriod'
import { Extension } from './extensions'

type BirthdayState = { birthday: number }

const initialBirthdayDate = dateToDaysSinceEpoch(new Date('1980-01-01T00:00+00:00'))

class BirthdayExtension extends Extension<BirthdayState, null> {
  public readonly name: string = BirthdayExtension.name

  setInitialState() {
    this.state = { birthday: initialBirthdayDate }
  }

  createForm(onUpdate: () => void) {
    return (
      <FormGroup label='Geburtsdatum'>
        <DateInput
          placeholder='Geburtsdatum'
          value={daysSinceEpochToDate(this.state?.birthday ?? initialBirthdayDate)}
          parseDate={value => {
            const millis = Date.parse(value)
            return isNaN(millis) ? false : new Date(millis)
          }}
          onChange={value => {
            if (value !== null) {
              this.state = { birthday: dateToDaysSinceEpoch(value) }
              onUpdate()
            }
          }}
          formatDate={date => date.toLocaleDateString()}
          minDate={sub(Date.now(), { years: 150 })}
          maxDate={new Date()}
          fill={true}
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
    return this.state !== null
  }
}

export default BirthdayExtension
