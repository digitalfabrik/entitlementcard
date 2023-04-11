import { Button, Callout, Card, H2 } from '@blueprintjs/core'

import PasswordInput from '../PasswordInput'

const ChangePasswordForm = (props: {
  currentPassword: string
  setCurrentPassword: (value: string) => void
  newPassword: string
  setNewPassword: (value: string) => void
  repeatNewPassword: string
  setRepeatNewPassword: (value: string) => void
  submitDisabled: boolean
  warnMessage: string | null
  loading: boolean
  submit: () => void
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Card style={{ maxWidth: '500px' }}>
        <H2>Passwort ändern</H2>
        <p>
          Ein gültiges Passwort ist mindestens zwölf Zeichen lang, enthält mindestens einen Klein- und einen
          Großbuchstaben sowie mindestens ein Sonderzeichen.
        </p>
        <form
          onSubmit={event => {
            event.preventDefault()
            props.submit()
          }}>
          <PasswordInput label='Aktuelles Passwort' value={props.currentPassword} setValue={props.setCurrentPassword} />
          <PasswordInput label='Neues Passwort' value={props.newPassword} setValue={props.setNewPassword} />
          <PasswordInput
            label='Neues Passwort bestätigen'
            value={props.repeatNewPassword}
            setValue={props.setRepeatNewPassword}
          />
          {props.warnMessage === null ? null : <Callout intent='danger'>{props.warnMessage}</Callout>}
          <div style={{ textAlign: 'right', padding: '10px 0' }}>
            <Button
              text={'Passwort ändern'}
              intent='primary'
              type='submit'
              disabled={props.submitDisabled}
              loading={props.loading}
            />
          </div>
        </form>
      </Card>
    </div>
  )
}

export default ChangePasswordForm
