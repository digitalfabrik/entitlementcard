import { TextField } from '@mui/material'
import { useContext, useState } from 'react'
import { Form } from '../../FormType'
import { FormContext } from '../SteppedSubForms'

type State = { type: 'NumberForm'; value: string }
type ValidatedInput = number
type Options = { min: number; max: number }
type AdditionalProps = { label: string; minWidth?: number }
const NumberForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: { type: 'NumberForm', value: '' },
  getArrayBufferKeys: () => [],
  getValidatedInput: ({ value }, options) => {
    const number = parseFloat(value)
    if (isNaN(number)) return { type: 'error', message: 'Eingabe ist keine Zahl.' }
    else if (number < options.min || number > options.max)
      return { type: 'error', message: `Wert muss zwischen ${options.min} und ${options.max} liegen.` }
    return { type: 'valid', value: number }
  },
  Component: ({ state, setState, label, options, minWidth = 100 }) => {
    const [touched, setTouched] = useState(false)
    const { showAllErrors, disableAllInputs } = useContext(FormContext)
    const validationResult = NumberForm.getValidatedInput(state, options)
    const isInvalid = validationResult.type === 'error'

    return (
      <TextField
        variant='standard'
        fullWidth
        style={{ margin: '4px 0', minWidth }}
        type='number'
        label={label}
        required
        disabled={disableAllInputs}
        error={(showAllErrors || touched) && isInvalid}
        value={state.value}
        onBlur={() => setTouched(true)}
        onChange={e => setState(() => ({ type: 'NumberForm', value: e.target.value }))}
        helperText={touched && isInvalid ? validationResult.message : ''}
        inputProps={{ inputMode: 'numeric', min: options.min, max: options.max }}
      />
    )
  },
}

export default NumberForm
