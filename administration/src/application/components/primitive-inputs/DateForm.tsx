import { TextField } from '@mui/material'
import { memo, useContext, useState } from 'react'
import { Form } from '../../FormType'
import { DateInput } from '../../../generated/graphql'
import { FormContext } from '../SteppedSubForms'

export type DateFormState = { type: 'DateForm'; value: string }
type ValidatedInput = DateInput
type Options = {}
type AdditionalProps = { label: string; minWidth?: number }
const DateForm: Form<DateFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: { type: 'DateForm', value: '' },
  getArrayBufferKeys: () => [],
  getValidatedInput: ({ value }) => {
    if (value === '') return { type: 'error', message: 'Feld ist erforderlich.' }
    const dateMillisecondsSinceEpoch = Date.parse(value)
    if (isNaN(dateMillisecondsSinceEpoch)) {
      return { type: 'error', message: 'Eingabe ist kein gültiges Datum.' }
    }
    const date = new Date(dateMillisecondsSinceEpoch)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const localISODate = `${year}-${`0${month}`.slice(-2)}-${`0${day}`.slice(-2)}`
    return { type: 'valid', value: { date: localISODate } }
  },
  Component: memo(({ state, setState, label, minWidth = 100 }) => {
    const [touched, setTouched] = useState(false)
    const { showAllErrors, disableAllInputs } = useContext(FormContext)
    const validationResult = DateForm.getValidatedInput(state)

    const isInvalid = validationResult.type === 'error'

    return (
      <TextField
        variant='standard'
        fullWidth
        style={{ margin: '4px 0', minWidth }}
        type='date'
        label={label}
        required
        disabled={disableAllInputs}
        error={touched && isInvalid}
        value={state.value}
        sx={{ '& input[value=""]:not(:focus)': { color: 'transparent' } }}
        onBlur={() => setTouched(true)}
        onChange={e => setState(() => ({ type: 'DateForm', value: e.target.value }))}
        helperText={(showAllErrors || touched) && isInvalid ? validationResult.message : ''}
      />
    )
  }),
}

export default DateForm
