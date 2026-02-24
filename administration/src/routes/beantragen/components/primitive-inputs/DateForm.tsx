import { FormGroup } from '@mui/material'
import React, { useContext, useState } from 'react'
import { Temporal } from 'temporal-polyfill'

import CustomDatePicker from '../../../../components/CustomDatePicker'
import FormAlert from '../../../../components/FormAlert'
import { DateInput } from '../../../../generated/graphql'
import i18next from '../../../../translations/i18n'
import { plainDateToLegacyDate } from '../../../../util/date'
import type { Form, FormComponentProps } from '../../util/formType'
import { FormContext } from '../forms/SteppedSubForms'

type State = { type: 'DateForm'; value: string }
type ValidatedInput = DateInput
type Options =
  | { maximumDate: Temporal.PlainDate; maximumDateErrorMessage: string }
  | { maximumDate: undefined }
type AdditionalProps = { label: string; minWidth?: number }

const minDate = Temporal.PlainDate.from('1900-01-01')

const parseDateFromState = (state: string): Date | null => {
  const date = new Date(state)
  return !Number.isNaN(date.valueOf()) ? date : null
}

const DateForm: Form<State, ValidatedInput, AdditionalProps, Options> = {
  initialState: { type: 'DateForm', value: '' },
  getArrayBufferKeys: () => [],
  validate: ({ value }, options) => {
    if (value.length === 0) {
      return { type: 'error', message: i18next.t('applicationForms:fieldRequiredError') }
    }

    try {
      const date = Temporal.PlainDate.from(value)

      if (Temporal.PlainDate.compare(date, minDate) <= 0) {
        return {
          type: 'error',
          message: i18next.t('applicationForms:dateBeforeMinDateError', { date: minDate }),
        }
      }
      if (options.maximumDate && Temporal.PlainDate.compare(date, options.maximumDate) > 0) {
        return { type: 'error', message: options.maximumDateErrorMessage }
      }
      return { type: 'valid', value: { date: date.toString() } }
    } catch {
      return { type: 'error', message: i18next.t('applicationForms:invalidDateError') }
    }
  },
  Component: ({
    state,
    setState,
    label,
    minWidth = 100,
    options,
  }: FormComponentProps<State, AdditionalProps, Options>) => {
    const [interacted, setInteracted] = useState(false)
    const { showAllErrors, disableAllInputs } = useContext(FormContext)
    const validationResult = DateForm.validate(state, options)
    const isInvalid = validationResult.type === 'error'

    return (
      <FormGroup>
        <CustomDatePicker
          value={parseDateFromState(state.value)}
          disabled={disableAllInputs}
          error={(showAllErrors || interacted) && isInvalid}
          label={label}
          minDate={plainDateToLegacyDate(minDate)}
          maxDate={options.maximumDate ? plainDateToLegacyDate(options.maximumDate) : undefined}
          onBlur={() => setInteracted(true)}
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
        <FormAlert
          errorMessage={
            (showAllErrors || interacted) && isInvalid ? validationResult.message : undefined
          }
        />
      </FormGroup>
    )
  },
}

export default DateForm
