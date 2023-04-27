import { FormGroup } from '@blueprintjs/core'
import { DateInput } from '@blueprintjs/datetime'
import { sub } from 'date-fns'

import { Extension } from '.'
import { dateToDaysSinceEpoch, daysSinceEpochToDate } from '../validityPeriod'

type BirthdayState = { birthday: number }

const initialBirthdayDate = dateToDaysSinceEpoch(new Date('1980-01-01T00:00+00:00'))

const birthday_extension: Extension<BirthdayState, null> = {
  getInitialState: () => ({ birthday: initialBirthdayDate }),
  createForm: (state, setState) => (
    <FormGroup label='Geburtsdatum'>
      <DateInput
        placeholder='Geburtsdatum'
        value={daysSinceEpochToDate(state?.birthday ?? initialBirthdayDate)}
        parseDate={value => {
          const millis = Date.parse(value)
          return isNaN(millis) ? false : new Date(millis)
        }}
        onChange={value => setState(value !== null ? { birthday: dateToDaysSinceEpoch(value) } : null)}
        formatDate={date => date.toLocaleDateString()}
        minDate={sub(Date.now(), { years: 150 })}
        maxDate={new Date()}
        fill={true}
      />
    </FormGroup>
  ),
  causesInfiniteLifetime: () => false,
  setProtobufData: (state, message) => {
    message.extensionBirthday = {
      birthday: state.birthday,
    }
  },
  isValid: state => state !== null,
}

export default birthday_extension
