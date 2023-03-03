import { TextField } from '@mui/material'
import { useContext, useState } from 'react'
import { Form } from '../../FormType'
import { DateInput } from '../../../generated/graphql'
import { FormContext } from '../SteppedSubForms'
import { formatISO, parseISO } from 'date-fns'

type State = { type: 'DateForm'; value: string }
type ValidatedInput = DateInput
type Options = { maximumDate: Date; maximumDateErrorMessage: string } | { maximumDate: null }
type AdditionalProps = { label: string; minWidth?: number }
const DateForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: { type: 'DateForm', value: '' },
  getArrayBufferKeys: () => [],
  validate: ({ value }, options) => {
    if (value === '') return { type: 'error', message: 'Feld ist erforderlich.' }
    const date = parseISO(value)
    if (isNaN(date.valueOf())) {
      return { type: 'error', message: 'Eingabe ist kein gültiges Datum.' }
    }

    if (options.maximumDate !== null) {
      if (date > options.maximumDate) {
        return { type: 'error', message: options.maximumDateErrorMessage }
      }
    }
    const localISODate = formatISO(date, { representation: 'date' })
    return { type: 'valid', value: { date: localISODate } }
  },
  Component: ({ state, setState, label, minWidth = 100, options }) => {
    const [touched, setTouched] = useState(false)
    const { showAllErrors, disableAllInputs } = useContext(FormContext)
    const validationResult = DateForm.validate(state, options)

    const isInvalid = validationResult.type === 'error'

    return (
      <TextField
        variant='standard'
        fullWidth
        style={{ margin: '4px 0', minWidth }}
        type='date'
        label={label}
        required
        inputProps={{
          max: options.maximumDate ? formatISO(options.maximumDate, { representation: 'date' }) : undefined,
          min: '1900-01-01',
        }}
        disabled={disableAllInputs}
        error={touched && isInvalid}
        value={state.value}
        sx={{ '& input[value=""]:not(:focus)': { color: 'transparent' } }}
        onBlur={() => setTouched(true)}
        onChange={e => setState(() => ({ type: 'DateForm', value: e.target.value }))}
        helperText={(showAllErrors || touched) && isInvalid ? validationResult.message : ''}
      />
    )
  },
}

export default DateForm
