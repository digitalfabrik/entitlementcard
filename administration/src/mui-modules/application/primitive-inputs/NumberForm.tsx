import { TextField } from '@mui/material'
import React, { useContext, useState } from 'react'

import { FormContext } from '../SteppedSubForms'
import { Form, FormComponentProps } from '../util/FormType'

type State = { type: 'NumberForm'; value: string }
type ValidatedInput = number
type Options = { min: number; max: number }
type AdditionalProps = { label: string; minWidth?: number }
const NumberForm: Form<State, ValidatedInput, AdditionalProps, Options> = {
  initialState: { type: 'NumberForm', value: '' },
  getArrayBufferKeys: () => [],
  validate: ({ value }, options) => {
    const number = parseFloat(value)
    if (Number.isNaN(number)) {
      return { type: 'error', message: 'Eingabe ist keine Zahl.' }
    }
    if (number < options.min || number > options.max) {
      return { type: 'error', message: `Wert muss zwischen ${options.min} und ${options.max} liegen.` }
    }
    return { type: 'valid', value: number }
  },
  Component: ({
    state,
    setState,
    label,
    options,
    minWidth = 100,
  }: FormComponentProps<State, AdditionalProps, Options>) => {
    const [touched, setTouched] = useState(false)
    const { showAllErrors, disableAllInputs } = useContext(FormContext)
    const validationResult = NumberForm.validate(state, options)
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
