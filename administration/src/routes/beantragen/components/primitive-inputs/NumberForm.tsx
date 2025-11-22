import { TextField } from '@mui/material'
import React, { useContext, useState } from 'react'

import FormAlert from '../../../../shared/components/FormAlert'
import i18next from '../../../../translations/i18n'
import { Form, FormComponentProps } from '../../util/FormType'
import { FormContext } from '../forms/SteppedSubForms'

type State = { type: 'NumberForm'; value: string }
type ValidatedInput = number
type Options = { min: number; max: number }
type AdditionalProps = { label: string; minWidth?: number }
const NumberForm: Form<State, ValidatedInput, AdditionalProps, Options> = {
  initialState: { type: 'NumberForm', value: '' },
  getArrayBufferKeys: () => [],
  validate: ({ value }, options) => {
    if (value === '') {
      return { type: 'error', message: i18next.t('applicationForms:fieldRequiredError') }
    }
    if (value.endsWith('.')) {
      return { type: 'error', message: i18next.t('applicationForms:noValidNumberError') }
    }
    const number = Number(value)
    const { min, max } = options
    if (Number.isNaN(number)) {
      return { type: 'error', message: i18next.t('applicationForms:noValidNumberError') }
    }
    if (number < min || number > max) {
      return { type: 'error', message: i18next.t('applicationForms:minMaxNumberError', { min, max }) }
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
        type='text'
        inputMode='decimal'
        label={label}
        required
        disabled={disableAllInputs}
        error={(showAllErrors || touched) && isInvalid}
        value={state.value}
        onBlur={() => setTouched(true)}
        onChange={e => {
          const sanitizedValue = e.target.value.replace(/\s/g, '')
          setState(() => ({ type: 'NumberForm', value: sanitizedValue }))
        }}
        helperText={<FormAlert errorMessage={touched && isInvalid ? validationResult.message : undefined} />}
        slotProps={{
          htmlInput: { inputMode: 'numeric', min: options.min, max: options.max },
        }}
      />
    )
  },
}

export default NumberForm
