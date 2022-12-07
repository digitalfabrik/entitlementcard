import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText } from '@mui/material'
import { useContext, useState } from 'react'
import { Form } from '../../FormType'
import { FormContext } from '../SteppedSubForms'

export type CheckboxFormState = { checked: boolean }
type ValidatedInput = boolean
type Options = { required: true; notCheckedErrorMessage: string } | { required: false }
type AdditionalProps = { label: string }
const CheckboxForm: Form<CheckboxFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: { checked: false },
  getArrayBufferKeys: () => [],
  getValidatedInput: ({ checked }, options) => {
    if (options.required && !checked) return { type: 'error', message: options.notCheckedErrorMessage }
    return { type: 'valid', value: checked }
  },
  Component: ({ state, setState, label, options }) => {
    const [touched, setTouched] = useState(false)
    const { disableAllInputs, showAllErrors } = useContext(FormContext)
    const validationResult = CheckboxForm.getValidatedInput(state, options)

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
            label={label}
          />
          {(showAllErrors || touched) && isInvalid ? <FormHelperText>{validationResult.message}</FormHelperText> : null}
        </FormControl>
      </FormGroup>
    )
  },
}

export default CheckboxForm
