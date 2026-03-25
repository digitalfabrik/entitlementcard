import { useMediaQuery } from '@mui/system'
import { deepmerge } from '@mui/utils'
import type { DesktopDatePickerSlotProps } from '@mui/x-date-pickers'
import { DesktopDatePicker } from '@mui/x-date-pickers'
import { deDE } from '@mui/x-date-pickers/locales'
import React, { ReactElement } from 'react'
import { Temporal } from 'temporal-polyfill'

import { plainDateFromLegacyDate, plainDateToLegacyDate } from '../util/date'

export type CustomDatePickerTextFieldProps = DesktopDatePickerSlotProps<true>['textField']

const CustomDatePicker = ({
  value,
  disabled,
  label,
  onBlur,
  onChange,
  onClear,
  onClose,
  error,
  minDate,
  maxDate,
  disableFuture,
  disablePast,
  textFieldHelperText,
  textFieldSlotProps,
}: {
  value?: Temporal.PlainDate | null
  disabled?: boolean
  label?: string
  onBlur?: () => void
  onClose?: () => void
  onChange?: (date: Temporal.PlainDate | null) => void
  onClear?: () => void
  error: boolean
  minDate?: Temporal.PlainDate
  maxDate?: Temporal.PlainDate
  disableFuture?: boolean
  disablePast?: boolean
  textFieldHelperText?: string
  textFieldSlotProps?: CustomDatePickerTextFieldProps
}): ReactElement => {
  const isMobile = !useMediaQuery('(pointer: fine)')

  return (
    <DesktopDatePicker
      disabled={disabled}
      label={label}
      views={['year', 'month', 'day']}
      openTo='year'
      value={value ? plainDateToLegacyDate(value) : null}
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
            /* Delay onBlur to allow click events on other elements to fire before the
               blur-triggered re-render shifts the layout and moves the click target */
            onBlur: onBlur ? () => setTimeout(onBlur, 200) : undefined,
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
          textFieldSlotProps,
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
      minDate={minDate ? plainDateToLegacyDate(minDate) : undefined}
      maxDate={maxDate ? plainDateToLegacyDate(maxDate) : undefined}
      onChange={date => onChange?.(date ? plainDateFromLegacyDate(date) : null)}
      onClose={onClose}
    />
  )
}

export default CustomDatePicker
