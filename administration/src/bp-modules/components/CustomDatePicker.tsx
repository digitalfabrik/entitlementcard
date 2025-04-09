import { useMediaQuery } from '@mui/system'
import { deepmerge } from '@mui/utils'
import { DesktopDatePicker } from '@mui/x-date-pickers'
import type { DesktopDatePickerSlotProps } from '@mui/x-date-pickers/DesktopDatePicker/DesktopDatePicker.types'
import { deDE } from '@mui/x-date-pickers/locales'
import React, { ReactElement } from 'react'

export type CustomDatePickerTextFieldProps = DesktopDatePickerSlotProps<Date, true>['textField']

type CustomDatePickerProps = {
  value?: Date | null
  disabled?: boolean
  label?: string
  onBlur?: () => void
  onChange?: (date: Date | null) => void
  onClear?: () => void
  error: boolean
  minDate?: Date
  maxDate?: Date
  disableFuture?: boolean
  disablePast?: boolean
  textFieldHelperText?: string
  textFieldSlotProps?: CustomDatePickerTextFieldProps
}

const CustomDatePicker = ({
  value,
  disabled,
  label,
  onBlur,
  onChange,
  onClear,
  error,
  minDate,
  maxDate,
  disableFuture,
  disablePast,
  textFieldHelperText,
  textFieldSlotProps,
}: CustomDatePickerProps): ReactElement => {
  const isMobile = !useMediaQuery('(pointer: fine)')

  return (
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
            error,
            spellCheck: false,
            onBlur,
            size: 'small',
            sx: {
              width: '100%',
              boxShadow: error
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
      // We use this property, since it (sort of) fixes some issues for Firefox Mobile (keyboard
      // does not show digits only). On the other hand, it introduces a bug with keyboard
      // navigation (inability to navigate out of component), so we switch on a media query here,
      // to provide a satisfying result.
      // TODO This property will become be the default and by then, hopefully all bugs will be fixed
      enableAccessibleFieldDOMStructure={isMobile}
      localeText={deDE.components.MuiLocalizationProvider.defaultProps.localeText}
      disableFuture={disableFuture}
      disablePast={disablePast}
      minDate={minDate}
      maxDate={maxDate}
      onChange={onChange}
    />
  )
}

export default CustomDatePicker
