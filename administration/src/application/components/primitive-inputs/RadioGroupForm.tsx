import { Divider, FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material'
import React from 'react'
import { useContext, useState } from 'react'
import { Form } from '../../FormType'
import { FormContext } from '../SteppedSubForms'

export type RadioGroupFormState = { selectedValue: string }
type ValidatedInput = { value: string }
type Options = { labelByValue: { [value: string]: string } }
type AdditionalProps = { divideItems: boolean; title: string }

const RadioGroupForm: Form<RadioGroupFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: { selectedValue: '' },
  getArrayBufferKeys: () => [],
  getValidatedInput: ({ selectedValue }, options) => {
    if (selectedValue.length === 0) return { type: 'error', message: 'Feld ist erforderlich.' }
    if (!Object.keys(options.labelByValue).includes(selectedValue))
      return {
        type: 'error',
        message: `Wert muss einer der auswählbaren Optionen entsprechen.`,
      }
    return { type: 'valid', value: { value: selectedValue } }
  },
  Component: ({ state, setState, options, divideItems, title }) => {
    const [touched, setTouched] = useState(false)
    const { showAllErrors, disableAllInputs } = useContext(FormContext)
    const validationResult = RadioGroupForm.getValidatedInput(state, options)
    const isInvalid = validationResult.type === 'error'

    return (
      <FormControl fullWidth variant='standard' required style={{ margin: '4px 0' }} error={touched && isInvalid}>
        <FormLabel>{title}</FormLabel>
        <RadioGroup
          sx={{ '& > label': { marginTop: '4px', marginBottom: '4px' } }}
          value={state.selectedValue}
          onBlur={() => setTouched(true)}
          onChange={e => setState(() => ({ selectedValue: e.target.value }))}>
          {Object.entries(options.labelByValue).map(([value, label], index, array) => (
            <React.Fragment key={index}>
              <FormControlLabel disabled={disableAllInputs} value={value} label={label} control={<Radio required />} />
              {divideItems && index < array.length - 1 ? <Divider variant='middle' /> : null}
            </React.Fragment>
          ))}
        </RadioGroup>
        {(showAllErrors || touched) && isInvalid ? <FormHelperText>{validationResult.message}</FormHelperText> : null}
      </FormControl>
    )
  },
}

export default RadioGroupForm
