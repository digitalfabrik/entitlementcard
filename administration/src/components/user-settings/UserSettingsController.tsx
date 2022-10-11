import { Button, Callout, Card, H2 } from '@blueprintjs/core'
import React, { useContext, useState } from 'react'
import { useChangePasswordMutation } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { AuthContext } from '../../AuthProvider'
import { useAppToaster } from '../AppToaster'
import PasswordInput from "../PasswordInput";

const isUpperCase = (value: string) => {
  return value === value.toUpperCase() && value !== value.toLowerCase()
}

const isLowerCase = (value: string) => {
  return value === value.toLowerCase() && value !== value.toUpperCase()
}

const isNumeric = (value: string) => {
  return !isNaN(parseInt(value))
}

const isSpecialChar = (value: string) => {
  return !isUpperCase(value) && !isLowerCase(value) && !isNumeric(value)
}

const getNumChars = (value: string, predicate: (char: string) => boolean): number => {
  return value.split('').filter(predicate).length
}

export default () => {
  const minPasswordLength = 12
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatNewPassword, setRepeatNewPassword] = useState('')

  const project = useContext(ProjectConfigContext).projectId
  const email = useContext(AuthContext).data!.administrator.email

  const appToaster = useAppToaster()
  const [changePassword, { loading }] = useChangePasswordMutation()

  const submitChange = async () => {
    try {
      const result = await changePassword({
        variables: {
          newPassword,
          currentPassword,
          email,
          project,
        },
      })
      if (result.errors) {
        console.error(result.errors)
        appToaster?.show({ intent: 'danger', message: 'Fehler beim Ändern des Passwortes.' })
      } else {
        appToaster?.show({
          intent: 'success',
          message: 'Passwort erfolgreich geändert.',
        })
        setCurrentPassword('')
        setNewPassword('')
        setRepeatNewPassword('')
      }
    } catch (e) {
      console.error(e)
      appToaster?.show({ intent: 'danger', message: 'Fehler beim Ändern des Passwortes.' })
    }
  }

  const isDirty = newPassword !== '' || repeatNewPassword !== ''

  let invalidMessage = null

  if (newPassword.length < minPasswordLength) {
    invalidMessage = (
      <Callout intent='danger'>
        Ihr Passwort muss mindestens {minPasswordLength} Zeichen lang sein (aktuell {newPassword.length}).
      </Callout>
    )
  } else if (getNumChars(newPassword, isLowerCase) < 1) {
    invalidMessage = <Callout intent='danger'>Ihr Passwort muss mindestens einen Kleinbuchstaben enthalten.</Callout>
  } else if (getNumChars(newPassword, isUpperCase) < 1) {
    invalidMessage = <Callout intent='danger'>Ihr Passwort muss mindestens einen Großbuchstaben enthalten.</Callout>
  } else if (getNumChars(newPassword, isSpecialChar) < 1) {
    invalidMessage = <Callout intent='danger'>Ihr Passwort muss mindestens ein Sonderzeichen enthalten.</Callout>
  } else if (newPassword !== repeatNewPassword) {
    invalidMessage = <Callout intent='danger'>Die Passwörter stimmen nicht überein.</Callout>
  }

  const valid = invalidMessage === null

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Card style={{ maxWidth: '500px' }}>
        <H2>Passwort ändern</H2>
        <p>
          Ein gültiges Passwort besteht aus mindestens zwölf Zeichen, einem Klein- und einem Großbuchstaben sowie einem
          Sonderzeichen.
        </p>
        <PasswordInput label='Aktuelles Passwort' value={currentPassword} setValue={setCurrentPassword} />
        <PasswordInput label='Neues Passwort' value={newPassword} setValue={setNewPassword} />
        <PasswordInput label='Neues Passwort bestätigen' value={repeatNewPassword} setValue={setRepeatNewPassword} />
        <div>{!isDirty ? null : invalidMessage}</div>
        <div style={{ textAlign: 'right', padding: '10px 0' }}>
          <Button
            text={'Passwort ändern'}
            intent='primary'
            disabled={!valid}
            onClick={submitChange}
            loading={loading}
          />
        </div>
      </Card>
    </div>
  )
}
