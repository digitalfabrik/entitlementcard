import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import { useContext, useState } from 'react'
import { Form } from '../../FormType'
import { ShortTextInput } from '../../../generated/graphql'
import { FormContext } from '../SteppedSubForms'

export type SelectFormState = { selectedText: string }
type ValidatedInput = ShortTextInput
type Options = { items: string[] }
type AdditionalProps = { label: string }
const SelectForm: Form<SelectFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: { selectedText: '' },
  getArrayBufferKeys: () => [],
  getValidatedInput: ({ selectedText }, options) => {
    if (selectedText.length === 0) return { type: 'error', message: 'Feld ist erforderlich.' }
    if (!options.items.includes(selectedText))
      return {
        type: 'error',
        message: `Wert muss einer der auswählbaren Optionen entsprechen.`,
      }
    return { type: 'valid', value: { shortText: selectedText } }
  },
  Component: ({ state, setState, label, options }) => {
    const [touched, setTouched] = useState(false)
    const { showAllErrors, disableAllInputs } = useContext(FormContext)
    const validationResult = SelectForm.getValidatedInput(state, options)
    const isInvalid = validationResult.type === 'error'

    return (
      <FormControl fullWidth variant='standard' required style={{ margin: '4px 0' }} error={touched && isInvalid}>
        <InputLabel>{label}</InputLabel>
        <Select
          disabled={disableAllInputs}
          value={state.selectedText}
          label={label}
          onBlur={() => setTouched(true)}
          onChange={e => setState(() => ({ selectedText: e.target.value }))}>
          {options.items.map(item => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
        {(showAllErrors || touched) && isInvalid ? <FormHelperText>{validationResult.message}</FormHelperText> : null}
      </FormControl>
    )
  },
}

export default SelectForm
