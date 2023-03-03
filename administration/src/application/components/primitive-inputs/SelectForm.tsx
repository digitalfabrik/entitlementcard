import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import { useContext, useState } from 'react'
import { Form } from '../../FormType'
import { ShortTextInput } from '../../../generated/graphql'
import { FormContext } from '../SteppedSubForms'

type State = { selectedValue: string; manuallySelected: boolean }
type ValidatedInput = ShortTextInput

export type SelectItem = { label: string; value: string }
type Options = {
  items: SelectItem[]
}
type AdditionalProps = { label: string }
const SelectForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: { selectedValue: '', manuallySelected: false },
  getArrayBufferKeys: () => [],
  validate: ({ selectedValue }, options) => {
    if (selectedValue.length === 0) return { type: 'error', message: 'Feld ist erforderlich.' }
    if (!options.items.map(item => item.value).includes(selectedValue)) {
      return {
        type: 'error',
        message: `Wert muss einer der auswählbaren Optionen entsprechen.`,
      }
    }
    return { type: 'valid', value: { shortText: selectedValue } }
  },
  Component: ({ state, setState, label, options }) => {
    const [touched, setTouched] = useState(false)
    const { showAllErrors, disableAllInputs } = useContext(FormContext)
    const validationResult = SelectForm.validate(state, options)
    const isInvalid = validationResult.type === 'error'

    return (
      <FormControl fullWidth variant='standard' required style={{ margin: '4px 0' }} error={touched && isInvalid}>
        <InputLabel>{label}</InputLabel>
        <Select
          disabled={disableAllInputs}
          value={state.selectedValue}
          label={label}
          onBlur={() => setTouched(true)}
          onChange={e => setState(() => ({ selectedValue: e.target.value, manuallySelected: true }))}>
          {options.items.map(item => (
            <MenuItem key={item.label} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
        {(showAllErrors || touched) && isInvalid ? <FormHelperText>{validationResult.message}</FormHelperText> : null}
      </FormControl>
    )
  },
}

export default SelectForm
