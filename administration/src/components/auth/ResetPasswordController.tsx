import { Button, Callout, Card, Classes, FormGroup, H2, H3, H4, InputGroup } from '@blueprintjs/core'
import { useContext, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import StandaloneCenter from '../StandaloneCenter'
import { useAppToaster } from '../AppToaster'
import { useCheckPasswordResetLinkQuery, useResetPasswordMutation } from '../../generated/graphql'
import PasswordInput from '../PasswordInput'
import validateNewPasswordInput from './validateNewPasswordInput'
import ErrorHandler from '../../ErrorHandler'
import getMessageFromApolloError from '../errors/getMessageFromApolloError'

const ResetPasswordController = () => {
  const config = useContext(ProjectConfigContext)
  const appToaster = useAppToaster()
  const [queryParams] = useSearchParams()
  const adminEmail = queryParams.get('email') ?? ''
  const [newPassword, setNewPassword] = useState('')
  const [repeatNewPassword, setRepeatNewPassword] = useState('')
  const navigate = useNavigate()

  const { error, refetch } = useCheckPasswordResetLinkQuery({
    variables: {
      project: config.projectId,
      resetKey: queryParams.get('token')!,
    },
  })

  const [resetPassword, { loading }] = useResetPasswordMutation({
    onCompleted: () => {
      appToaster?.show({ intent: 'success', message: 'Ihr Passwort wurde erfolgreich zurückgesetzt.' })
      navigate('/')
    },
    onError: () =>
      appToaster?.show({
        intent: 'danger',
        message: 'Etwas ist schief gelaufen. Prüfen Sie Ihre Eingaben.',
      }),
  })

  const submit = () =>
    resetPassword({
      variables: {
        project: config.projectId,
        email: adminEmail,
        newPassword,
        passwordResetKey: queryParams.get('token')!,
      },
    })

  const warnMessage = validateNewPasswordInput(newPassword, repeatNewPassword)
  const isDirty = newPassword !== '' || repeatNewPassword !== ''

  if (error) {
    const { title, description } = getMessageFromApolloError(error)
    return <ErrorHandler title={title} refetch={refetch} description={description} />
  }

  return (
    <StandaloneCenter>
      <Card style={{ width: '100%', maxWidth: '500px' }}>
        <H2>{config.name}</H2>
        <H3>Verwaltung</H3>
        <H4>Passwort zurücksetzen.</H4>
        <p>
          Hier können Sie ein neues Passwort wählen. Ein gültiges Passwort ist mindestens zwölf Zeichen lang, enthält
          mindestens einen Klein- und einen Großbuchstaben sowie mindestens ein Sonderzeichen.
        </p>
        <form
          onSubmit={e => {
            e.preventDefault()
            submit()
          }}>
          <FormGroup label='Email-Adresse'>
            <InputGroup value={adminEmail} disabled type='email' />
          </FormGroup>
          <PasswordInput label='Neues Passwort' setValue={setNewPassword} value={newPassword} />
          <PasswordInput label='Neues Passwort bestätigen' setValue={setRepeatNewPassword} value={repeatNewPassword} />
          {warnMessage === null || !isDirty ? null : <Callout intent='danger'>{warnMessage}</Callout>}
          <div
            className={Classes.DIALOG_FOOTER_ACTIONS}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
            <Link to='/'>Zurück zum Login</Link>
            <Button
              type='submit'
              intent='primary'
              text='Passwort zurücksetzen'
              loading={loading}
              disabled={warnMessage !== null}
            />
          </div>
        </form>
      </Card>
    </StandaloneCenter>
  )
}

export default ResetPasswordController
