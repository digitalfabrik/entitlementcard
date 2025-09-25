import { Classes, InputGroup } from '@blueprintjs/core'
import { Button, FormControl, FormLabel, Stack } from '@mui/material'
import React, { ChangeEvent, ReactElement } from 'react'
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
          <InputGroup
            placeholder='erika.musterfrau@example.org'
            autoFocus
            autoComplete='on'
            name='email'
            value={email}
            disabled={loading}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
          />
        </FormControl>
        <FormControl fullWidth>
          <FormLabel>{t('password')}</FormLabel>
          <PasswordInput placeholder='Passwort' value={password} disabled={loading} setValue={setPassword} />
        </FormControl>
        <div
          className={Classes.DIALOG_FOOTER_ACTIONS}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to='/forgot-password'>
            <Button variant='text'>{t('forgotPassword')}</Button>
          </Link>
          <Button type='submit' variant='contained' loading={loading}>
            Anmelden
          </Button>
        </div>
      </Stack>
    </form>
  )
}

export default LoginForm
