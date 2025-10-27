import { Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import React, { useContext, useState } from 'react'

import i18next from '../../../i18n'
import FormAlert from '../../base/FormAlert'
import { FormContext } from '../SteppedSubForms'
import { Form, FormComponentProps, ValidationResult } from '../util/FormType'

type State<T extends string> = { selectedValue: T | null }
type ValidatedInput<T extends string> = T
type Options<T extends string> = { labelByValue: { [value in T]: string } }
type AdditionalProps = { divideItems: boolean; title: string }
type RadioGroupForm<T extends string> = Form<State<T>, ValidatedInput<T>, AdditionalProps, Options<T>>

export const createRadioGroupForm = <T extends string>(): RadioGroupForm<T> => {
  const validate = ({ selectedValue }: State<T>, options: Options<T>): ValidationResult<T> => {
    if (selectedValue === null) {
      return { type: 'error', message: i18next.t('applicationForms:fieldRequiredError') }
    }
    if (!Object.keys(options.labelByValue).includes(selectedValue)) {
      return {
        type: 'error',
        message: i18next.t('applicationForms:valueHasToBeSelectableOptionError'),
      }
    }
    return { type: 'valid', value: selectedValue }
  }
  return {
    initialState: { selectedValue: null },
    getArrayBufferKeys: () => [],
    validate,
    Component: ({
      state,
      setState,
      options,
      divideItems,
      title,
    }: FormComponentProps<State<T>, AdditionalProps, Options<T>>) => {
      const [touched, setTouched] = useState(false)
      const { showAllErrors, disableAllInputs } = useContext(FormContext)
      const validationResult = validate(state, options)
      const isInvalid = validationResult.type === 'error'
      const labelByValueEntries: [T, string][] = Object.entries(options.labelByValue) as [T, string][]
      return (
        <FormControl fullWidth variant='standard' required sx={{ marginY: 0.5 }} error={touched && isInvalid}>
          <FormLabel>{title}</FormLabel>
          <RadioGroup
            sx={{ '& > label': { marginTop: '4px', marginBottom: '4px' } }}
            value={state.selectedValue}
            onBlur={() => setTouched(true)}
            onChange={e => setState(() => ({ selectedValue: e.target.value as T }))}>
            {labelByValueEntries.map(([value, label], index, array) => (
              <React.Fragment key={label}>
                <FormControlLabel
                  disabled={disableAllInputs}
                  value={value}
                  label={label}
                  control={<Radio required />}
                />
                {divideItems && index < array.length - 1 ? <Divider variant='middle' /> : null}
              </React.Fragment>
            ))}
          </RadioGroup>
          {(showAllErrors || touched) && isInvalid && <FormAlert errorMessage={validationResult.message} />}
        </FormControl>
      )
    },
  }
}

export default createRadioGroupForm()
