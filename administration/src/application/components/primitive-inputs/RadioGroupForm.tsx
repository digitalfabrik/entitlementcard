import { Divider, FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material'
import React from 'react'
import { useContext, useState } from 'react'
import { Form, ValidationResult } from '../../FormType'
import { FormContext } from '../SteppedSubForms'

type RadioGroupFormState<T extends string> = { selectedValue: T | '' }
type ValidatedInput<T extends string> = T
type Options<T extends string> = { labelByValue: { [value in T]: string } }
type AdditionalProps = { divideItems: boolean; title: string }

export function createRadioGroupForm<T extends string>(): Form<
  RadioGroupFormState<T>,
  Options<T>,
  ValidatedInput<T>,
  AdditionalProps
> {
  const getValidatedInput = ({ selectedValue }: RadioGroupFormState<T>, options: Options<T>): ValidationResult<T> => {
    if (selectedValue === '') return { type: 'error', message: 'Feld ist erforderlich.' }
    if (!Object.keys(options.labelByValue).includes(selectedValue))
      return {
        type: 'error',
        message: `Wert muss einer der auswählbaren Optionen entsprechen.`,
      }
    return { type: 'valid', value: selectedValue }
  }
  return {
    initialState: { selectedValue: '' },
    getArrayBufferKeys: () => [],
    getValidatedInput,
    Component: ({ state, setState, options, divideItems, title }) => {
      const [touched, setTouched] = useState(false)
      const { showAllErrors, disableAllInputs } = useContext(FormContext)
      const validationResult = getValidatedInput(state, options)
      const isInvalid = validationResult.type === 'error'

      return (
        <FormControl fullWidth variant='standard' required style={{ margin: '4px 0' }} error={touched && isInvalid}>
          <FormLabel>{title}</FormLabel>
          <RadioGroup
            sx={{ '& > label': { marginTop: '4px', marginBottom: '4px' } }}
            value={state.selectedValue}
            onBlur={() => setTouched(true)}
            onChange={e => setState(() => ({ selectedValue: e.target.value as T | '' }))}>
            {Object.entries(options.labelByValue).map(([value, label], index, array) => (
              <React.Fragment key={index}>
                <FormControlLabel
                  disabled={disableAllInputs}
                  value={value}
                  label={label as string}
                  control={<Radio required />}
                />
                {divideItems && index < array.length - 1 ? <Divider variant='middle' /> : null}
              </React.Fragment>
            ))}
          </RadioGroup>
          {(showAllErrors || touched) && isInvalid ? <FormHelperText>{validationResult.message}</FormHelperText> : null}
        </FormControl>
      )
    },
  }
}

export default createRadioGroupForm()
