import { DesktopDatePicker } from '@mui/x-date-pickers'
import { deDE } from '@mui/x-date-pickers/locales'
import React, { CSSProperties, ReactElement } from 'react'

import useWindowDimensions from '../../hooks/useWindowDimensions'

type CustomDatePickerProps = {
  date: Date | null
  disabled?: boolean
  label?: string
  onBlur?: () => void
  onChange?: (date: Date | null) => void
  onClear?: () => void
  isValid: boolean
  minDate?: Date
  maxDate?: Date
  disableFuture?: boolean
  textFieldHelperText?: string
  textFieldStyle?: CSSProperties
}

const CustomDatePicker = ({
  date,
  disabled,
  label,
  onBlur,
  onChange,
  onClear,
  isValid,
  minDate,
  maxDate,
  disableFuture,
  textFieldHelperText,
  textFieldStyle,
}: CustomDatePickerProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const textFieldBoxShadow = `
    0 0 0 0 rgba(205, 66, 70, 0),
    inset 0 0 0 1px rgba(17, 20, 24, 0.2),
  `

  return (
    <DesktopDatePicker
      disabled={disabled}
      label={label}
      views={['year', 'month', 'day']}
      openTo='year'
      value={date}
      format='dd.MM.yyyy'
      sx={{ '& input[value=""]:not(:focus)': { color: 'transparent' } }}
      slotProps={{
        clearIcon: { fontSize: viewportSmall ? 'medium' : 'small' },
        openPickerIcon: { fontSize: 'small' },
        field: { clearable: true, onClear },
        textField: {
          helperText: textFieldHelperText,
          placeholder: 'TT.MM.JJJJ',
          error: !isValid,
          spellCheck: false,
          onBlur,
          style: textFieldStyle,
          sx: {
            width: '100%',
            boxShadow: !isValid ? textFieldBoxShadow : undefined,
          },
        },
      }}
      enableAccessibleFieldDOMStructure
      localeText={deDE.components.MuiLocalizationProvider.defaultProps.localeText}
      disableFuture={disableFuture}
      minDate={minDate}
      maxDate={maxDate}
      onChange={onChange}
    />
  )
}

export default CustomDatePicker
