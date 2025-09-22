/* eslint-disable react/destructuring-assignment */
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, InputAdornment, OutlinedInput, SxProps, Tooltip } from '@mui/material'
import { Theme } from '@mui/system'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

const PasswordInput = (p: {
  sx?: SxProps<Theme>
  placeholder?: string
  disabled?: boolean
  required?: boolean
  value?: string
  setValue?: (v: string | undefined) => void
}): ReactElement => {
  const { t } = useTranslation('misc')
  const [passwordHidden, setPasswordHidden] = useState(true)
  return (
    <OutlinedInput
      placeholder={p.placeholder}
      type={passwordHidden ? 'password' : 'text'}
      size='small'
      required
      disabled={p.disabled}
      value={p.value}
      sx={p.sx}
      endAdornment={
        <InputAdornment position='end'>
          <Tooltip title={t(passwordHidden ? 'showPassword' : 'hidePassword')}>
            <IconButton
              aria-label={t(passwordHidden ? 'showPassword' : 'hidePassword')}
              onClick={() => {
                setPasswordHidden(!passwordHidden)
              }}
              edge='end'>
              {passwordHidden ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </Tooltip>
        </InputAdornment>
      }
      onChange={event => p.setValue?.(event.currentTarget.value)}
    />
  )
}

export default PasswordInput
