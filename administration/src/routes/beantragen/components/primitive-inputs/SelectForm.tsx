import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useContext, useId, useState } from 'react'

import FormAlert from '../../../../components/FormAlert'
import { ShortTextInput } from '../../../../graphql'
import i18next from '../../../../translations/i18n'
import { Form, FormComponentProps } from '../../util/formType'
import { FormContext } from '../forms/SteppedSubForms'

type State = { selectedValue: string; manuallySelected: boolean }
type ValidatedInput = ShortTextInput

export type SelectItem = { label: string; value: string }
type Options = {
  items: SelectItem[]
}
type AdditionalProps = { label: string; required?: boolean }
const SelectForm: Form<State, ValidatedInput, AdditionalProps, Options> = {
  initialState: { selectedValue: '', manuallySelected: false },
  getArrayBufferKeys: () => [],
  validate: ({ selectedValue }, options) => {
    if (selectedValue.length === 0) {
      return { type: 'error', message: i18next.t('applicationForms:fieldRequiredError') }
    }
    if (!options.items.map(item => item.value).includes(selectedValue)) {
      return {
        type: 'error',
        message: i18next.t('applicationForms:valueHasToBeSelectableOptionError'),
      }
    }
    return { type: 'valid', value: { shortText: selectedValue } }
  },
  Component: ({
    state,
    setState,
    label,
    options,
    required = true,
  }: FormComponentProps<State, AdditionalProps, Options>) => {
    const [interacted, setInteracted] = useState(false)
    const { showAllErrors, disableAllInputs } = useContext(FormContext)
    const labelId = useId()

    const validationResult = SelectForm.validate(state, options)
    const isInvalid =
      validationResult.type === 'error' && (required || state.selectedValue.length > 0)

    return (
      <FormControl
        fullWidth
        variant='standard'
        required={required}
        style={{ margin: '4px 0' }}
        error={interacted && isInvalid}
      >
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select
          labelId={labelId}
          disabled={disableAllInputs}
          value={state.selectedValue}
          label={label}
          onBlur={() => setInteracted(true)}
          onChange={e =>
            setState(() => ({ selectedValue: e.target.value, manuallySelected: true }))
          }
        >
          {/* Non-breaking space keeps the empty option from collapsing to zero height */}
          {!required && <MenuItem value=''>&nbsp;</MenuItem>}
          {options.items.map(item => (
            <MenuItem key={item.label} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
        {(showAllErrors || interacted) && isInvalid && (
          <FormAlert errorMessage={validationResult.message} />
        )}
      </FormControl>
    )
  },
}

export const OptionalSelectForm: Form<State, ValidatedInput | null, AdditionalProps, Options> = {
  initialState: SelectForm.initialState,
  getArrayBufferKeys: SelectForm.getArrayBufferKeys,
  validate: (state, options) => {
    if (state.selectedValue.length === 0) {
      return { type: 'valid', value: null }
    }
    return SelectForm.validate(state, options)
  },
  Component: props => <SelectForm.Component {...props} required={false} />,
}

export default SelectForm
