import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, { useContext, useState } from 'react'

import { ShortTextInput } from '../../../../generated/graphql'
import FormAlert from '../../../../shared/components/FormAlert'
import i18next from '../../../../translations/i18n'
import { Form, FormComponentProps } from '../../util/FormType'
import { FormContext } from '../forms/SteppedSubForms'

type State = { selectedValue: string; manuallySelected: boolean }
type ValidatedInput = ShortTextInput

export type SelectItem = { label: string; value: string }
type Options = {
  items: SelectItem[]
}
type AdditionalProps = { label: string }
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
  Component: ({ state, setState, label, options }: FormComponentProps<State, AdditionalProps, Options>) => {
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
        {(showAllErrors || touched) && isInvalid && <FormAlert errorMessage={validationResult.message} />}
      </FormControl>
    )
  },
}

export default SelectForm
