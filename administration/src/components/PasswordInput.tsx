/* eslint-disable react/destructuring-assignment */
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, InputAdornment, SxProps, TextField, Tooltip } from '@mui/material'
import { Theme } from '@mui/system'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

const PasswordInput = (p: {
  sx?: SxProps<Theme>
  placeholder?: string
  label?: string
  disabled?: boolean
  autoFocus?: boolean
  fullWidth?: boolean
  value?: string
  setValue?: (v: string) => void
}): ReactElement => {
  const { t } = useTranslation('misc')
  const [passwordHidden, setPasswordHidden] = useState(true)
  return (
    <TextField
      placeholder={p.placeholder}
      type={passwordHidden ? 'password' : 'text'}
      size='small'
      required
      label={p.label}
      autoComplete='on'
      autoFocus={p.autoFocus}
      fullWidth={p.fullWidth}
      disabled={p.disabled}
      value={p.value}
      sx={p.sx}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position='end'>
              <Tooltip title={t(passwordHidden ? 'showPassword' : 'hidePassword')}>
                <IconButton
                  aria-label={t(passwordHidden ? 'showPassword' : 'hidePassword')}
                  onClick={() => {
                    setPasswordHidden(!passwordHidden)
                  }}
                  edge='end'
                >
                  {passwordHidden ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        },
      }}
      onChange={event => p.setValue?.(event.currentTarget.value)}
    />
  )
}

export default PasswordInput
