import { Button, Classes, FormGroup, InputGroup } from '@blueprintjs/core'
import React, { ChangeEvent, ReactElement } from 'react'
import { Link } from 'react-router-dom'

import PasswordInput from '../PasswordInput'

type Props = {
  loading?: boolean
  email: string
  password: string
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  onSubmit: () => void
}

const LoginForm = (props: Props): ReactElement => {
  return (
    <div style={{ marginTop: '20px' }}>
      <form
        onSubmit={event => {
          event.preventDefault()
          props.onSubmit()
        }}>
        <FormGroup label='E-Mail'>
          <InputGroup
            placeholder='erika.musterfrau@example.org'
            autoFocus
            autoComplete='on'
            name='email'
            value={props.email}
            disabled={!!props.loading}
            onChange={(event: ChangeEvent<HTMLInputElement>) => props.setEmail(event.target.value)}
          />
        </FormGroup>
        <FormGroup label='Passwort'>
          <PasswordInput
            placeholder='Passwort'
            value={props.password}
            disabled={!!props.loading}
            setValue={props.setPassword}
            label=''
          />
        </FormGroup>
        <div
          className={Classes.DIALOG_FOOTER_ACTIONS}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to='/forgot-password'>Passwort vergessen</Link>
          <Button text='Anmelden' type='submit' intent='primary' loading={!!props.loading} />
        </div>
      </form>
    </div>
  )
}

export default LoginForm
