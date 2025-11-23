import { ReactElement, useContext, useState } from 'react'

import BaseCheckbox from '../../base/BaseCheckbox'
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
      <BaseCheckbox
        disabled={disableAllInputs}
        required={options.required}
        checked={state.checked}
        label={label}
        onChange={checked => setState(() => ({ checked }))}
        hasError={(showAllErrors || touched) && isInvalid}
        errorMessage={isInvalid ? validationResult.message : null}
        onBlur={() => setTouched(true)}
      />
    )
  },
}

export default CheckboxForm
