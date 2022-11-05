import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import { useState } from 'react'
import { Form } from '../../FormType'

export type SelectFormState = string
type ValidatedInput = string
type Options = { items: string[] }
type AdditionalProps = { label: string }
const selectForm: Form<SelectFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: '',
  getValidatedInput: (state, options) => {
    if (state.length === 0) return { type: 'error', message: 'Feld ist erforderlich.' }
    if (!options.items.includes(state))
      return {
        type: 'error',
        message: `Wert muss einer der auswählbaren Optionen entsprechen.`,
      }
    return { type: 'valid', value: state }
  },
  Component: ({ state, setState, label, options }) => {
    const [touched, setTouched] = useState(false)
    const validationResult = selectForm.getValidatedInput(state, options)
    const isInvalid = validationResult.type === 'error'

    return (
      <FormControl fullWidth variant='standard' required style={{ margin: '4px 0' }} error={touched && isInvalid}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={state}
          label={label}
          onBlur={() => setTouched(true)}
          onChange={e => setState(() => e.target.value)}>
          {options.items.map(item => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
        {!touched || !isInvalid ? null : <FormHelperText>{validationResult.message}</FormHelperText>}
      </FormControl>
    )
  },
}

export default selectForm
