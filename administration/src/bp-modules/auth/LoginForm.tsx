import { Box, Button, FormControl, FormLabel, Stack, TextField } from '@mui/material'
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
      <Stack sx={{ gap: 2 }}>
        <FormControl fullWidth>
          <FormLabel>{t('eMail')}</FormLabel>
          <TextField
            placeholder='erika.musterfrau@example.org'
            fullWidth
            autoComplete='on'
            autoFocus
            type='email'
            size='small'
            value={email}
            required
            disabled={loading}
            onChange={event => setEmail(event.target.value)}
          />
        </FormControl>
        <FormControl fullWidth>
          <FormLabel>{t('password')}</FormLabel>
          <PasswordInput required placeholder='Passwort' value={password} disabled={loading} setValue={setPassword} />
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
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
