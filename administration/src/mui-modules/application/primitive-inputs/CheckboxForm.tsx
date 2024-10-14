import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText } from '@mui/material'
import React, { ReactElement, useContext, useState } from 'react'

import { FormContext } from '../SteppedSubForms'
import { Form, FormComponentProps } from '../util/FormType'

type State = { checked: boolean }
type ValidatedInput = boolean
type Options = { required: true; notCheckedErrorMessage: string } | { required: false }
type AdditionalProps = { label: string | ReactElement }
const CheckboxForm: Form<State, ValidatedInput, AdditionalProps, Options> = {
  initialState: { checked: false },
  getArrayBufferKeys: () => [],
  validate: ({ checked }, options) => {
    if (options.required && !checked) {
      return { type: 'error', message: options.notCheckedErrorMessage }
    }
    return { type: 'valid', value: checked }
  },
  Component: ({ state, setState, label, options }: FormComponentProps<State, AdditionalProps, Options>) => {
    const [touched, setTouched] = useState(false)
    const { disableAllInputs, showAllErrors } = useContext(FormContext)
    const validationResult = CheckboxForm.validate(state, options)

    const isInvalid = validationResult.type === 'error'

    return (
      <FormGroup onBlur={() => setTouched(true)}>
        <FormControl required={options.required} error={touched && isInvalid} disabled={disableAllInputs}>
          <FormControlLabel
            style={{ margin: '8px 0' }}
            control={
              <Checkbox
                required={options.required}
                checked={state.checked}
                onChange={e => {
                  setTouched(true)
                  setState(() => ({ checked: e.target.checked }))
                }}
              />
            }
            label={
              <>
                {label}
                {options.required ? ' *' : ''}
              </>
            }
          />
          {(showAllErrors || touched) && isInvalid ? <FormHelperText>{validationResult.message}</FormHelperText> : null}
        </FormControl>
      </FormGroup>
    )
  },
}

export default CheckboxForm
