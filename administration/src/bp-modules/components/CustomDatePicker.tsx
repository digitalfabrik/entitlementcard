import { deepmerge } from '@mui/utils'
import { DesktopDatePicker } from '@mui/x-date-pickers'
import type { DesktopDatePickerSlotProps } from '@mui/x-date-pickers/DesktopDatePicker/DesktopDatePicker.types'
import { deDE } from '@mui/x-date-pickers/locales'
import React, { ReactElement } from 'react'

type CustomDatePickerProps = {
  value?: Date | null
  disabled?: boolean
  label?: string
  onBlur?: () => void
  onChange?: (date: Date | null) => void
  onClear?: () => void
  isValid: boolean
  minDate?: Date
  maxDate?: Date
  disableFuture?: boolean
  disablePast?: boolean
  textFieldHelperText?: string
  textFieldSlotProps?: DesktopDatePickerSlotProps<Date, true>['textField']
}

const CustomDatePicker = ({
  value,
  disabled,
  label,
  onBlur,
  onChange,
  onClear,
  isValid,
  minDate,
  maxDate,
  disableFuture,
  disablePast,
  textFieldHelperText,
  textFieldSlotProps,
}: CustomDatePickerProps): ReactElement => (
  <DesktopDatePicker
    disabled={disabled}
    label={label}
    views={['year', 'month', 'day']}
    openTo='year'
    value={value}
    format='dd.MM.yyyy'
    sx={{ '& input[value=""]:not(:focus)': { color: 'transparent' } }}
    slotProps={{
      openPickerIcon: { fontSize: 'small' },
      field: {
        clearable: true,
        onClear,
      },
      textField: deepmerge(
        {
          helperText: textFieldHelperText,
          placeholder: 'TT.MM.JJJJ',
          error: !isValid,
          spellCheck: false,
          onBlur,
          size: 'small',
          sx: {
            width: '100%',
            boxShadow: !isValid
              ? `
                0 0 0 0 rgba(205, 66, 70, 0),
                inset 0 0 0 1px #cd4246,
                inset 0 0 0 1px rgba(17, 20, 24, 0.2),
                inset 0 1px 1px rgba(17, 20, 24, 0.3),
              `
              : undefined,
            '.MuiPickersInputBase-root': {
              borderRadius: '2px',
            },
          },
        },
        textFieldSlotProps
      ),
    }}
    enableAccessibleFieldDOMStructure
    localeText={deDE.components.MuiLocalizationProvider.defaultProps.localeText}
    disableFuture={disableFuture}
    disablePast={disablePast}
    minDate={minDate}
    maxDate={maxDate}
    onChange={onChange}
  />
)

export default CustomDatePicker
