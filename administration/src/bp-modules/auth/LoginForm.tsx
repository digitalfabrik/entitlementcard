import { Box, Button, FormControl, InputLabel, Stack, TextField } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import PasswordInput from '../PasswordInput'

const LoginForm = ({
  loading,
  email,
  password,
  setEmail,
  setPassword,
  onSubmit,
}: {
  loading?: boolean
  email: string
  password: string
  setEmail: (email: string) => void
  setPassword: (password: string | undefined) => void
  onSubmit: () => void
}): ReactElement => {
  const { t } = useTranslation('auth')
  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        onSubmit()
      }}>
      <Stack sx={{ gap: 2, marginY: 2 }}>
        <TextField
          placeholder='erika.musterfrau@example.org'
          fullWidth
          autoComplete='on'
          autoFocus
          type='email'
          size='small'
          label={t('eMail')}
          value={email}
          required
          disabled={loading}
          onChange={event => setEmail(event.target.value)}
        />
        <FormControl variant='outlined'>
          <InputLabel required size='small'>
            {t('password')}
          </InputLabel>
          <PasswordInput
            label={t('password')}
            placeholder='Passwort'
            value={password}
            disabled={loading}
            fullWidth
            setValue={setPassword}
            required
            autoFocus={false}
          />
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to='/forgot-password'>
            <Button variant='text'>{t('forgotPassword')}</Button>
          </Link>
          <Button type='submit' variant='contained' color='primary' loading={loading}>
            {t('signIn')}
          </Button>
        </Box>
      </Stack>
    </form>
  )
}

export default LoginForm
