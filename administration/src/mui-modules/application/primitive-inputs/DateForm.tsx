import { FormGroup } from '@mui/material'
import { formatISO, parseISO } from 'date-fns'
import React, { useContext, useState } from 'react'

import CustomDatePicker from '../../../bp-modules/components/CustomDatePicker'
import { DateInput } from '../../../generated/graphql'
import i18next from '../../../i18n'
import FormAlert from '../../base/FormAlert'
import { FormContext } from '../SteppedSubForms'
import type { Form, FormComponentProps } from '../util/FormType'

type State = { type: 'DateForm'; value: string }
type ValidatedInput = DateInput
type Options = { maximumDate: Date; maximumDateErrorMessage: string } | { maximumDate: undefined }
type AdditionalProps = { label: string; minWidth?: number }

const minDate = new Date('1900-01-01')

const parseDateFromState = (state: string): Date | null => {
  const date = new Date(state)
  return !Number.isNaN(date.valueOf()) ? date : null
}

const DateForm: Form<State, ValidatedInput, AdditionalProps, Options> = {
  initialState: { type: 'DateForm', value: '' },
  getArrayBufferKeys: () => [],
  validate: ({ value }, options) => {
    if (value === '') {
      return { type: 'error', message: i18next.t('applicationForms:fieldRequiredError') }
    }

    const date = parseISO(value)

    if (Number.isNaN(date.valueOf())) {
      return { type: 'error', message: i18next.t('applicationForms:invalidDateError') }
    }
    if (date <= minDate) {
      return { type: 'error', message: 'Das Datum muss nach dem 1.1.1900 liegen' }
    }
    if (options.maximumDate && date > options.maximumDate) {
      return { type: 'error', message: options.maximumDateErrorMessage }
    }
    return { type: 'valid', value: { date: formatISO(date, { representation: 'date' }) } }
  },
  Component: ({
    state,
    setState,
    label,
    minWidth = 100,
    options,
  }: FormComponentProps<State, AdditionalProps, Options>) => {
    const [touched, setTouched] = useState(false)
    const { showAllErrors, disableAllInputs } = useContext(FormContext)
    const validationResult = DateForm.validate(state, options)
    const isInvalid = validationResult.type === 'error'

    return (
      <FormGroup>
        <CustomDatePicker
          value={parseDateFromState(state.value)}
          disabled={disableAllInputs}
          error={(showAllErrors || touched) && isInvalid}
          label={label}
          minDate={minDate}
          maxDate={options.maximumDate}
          onBlur={() => setTouched(true)}
          onChange={date => {
            setState(() => ({
              type: 'DateForm',
              // Catch invalid dates: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#the_epoch_timestamps_and_invalid_date
              value: date && !Number.isNaN(date.valueOf()) ? date.toISOString() : '',
            }))
          }}
          textFieldSlotProps={{
            required: true,
            variant: 'standard',
            style: { margin: '4px 0', minWidth },
            sx: {
              input: { paddingTop: '4px' },
              '.MuiInputAdornment-root': { transform: 'translateX(-8px)' },
            },
          }}
        />
        <FormAlert errorMessage={(showAllErrors || touched) && isInvalid ? validationResult.message : undefined} />
      </FormGroup>
    )
  },
}

export default DateForm
