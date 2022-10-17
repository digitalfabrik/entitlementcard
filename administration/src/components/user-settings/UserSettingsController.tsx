import React, { useContext, useState } from 'react'
import { useChangePasswordMutation } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { AuthContext } from '../../AuthProvider'
import { useAppToaster } from '../AppToaster'
import ChangePasswordForm from './ChangePasswordForm'

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

const UserSettingsController = () => {
  const minPasswordLength = 12
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatNewPassword, setRepeatNewPassword] = useState('')

  const project = useContext(ProjectConfigContext).projectId
  const email = useContext(AuthContext).data!.administrator.email

  const appToaster = useAppToaster()
  const [changePassword, { loading }] = useChangePasswordMutation()

  const submit = async () => {
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

  let warnMessage: string | null = null

  if (newPassword.length < minPasswordLength) {
    warnMessage = `Ihr Passwort muss mindestens ${minPasswordLength} Zeichen lang sein (aktuell ${newPassword.length}).`
  } else if (getNumChars(newPassword, isLowerCase) < 1) {
    warnMessage = 'Ihr Passwort muss mindestens einen Kleinbuchstaben enthalten.'
  } else if (getNumChars(newPassword, isUpperCase) < 1) {
    warnMessage = warnMessage = 'Ihr Passwort muss mindestens einen Großbuchstaben enthalten.'
  } else if (getNumChars(newPassword, isSpecialChar) < 1) {
    warnMessage = 'Ihr Passwort muss mindestens ein Sonderzeichen enthalten.'
  } else if (newPassword !== repeatNewPassword) {
    warnMessage = 'Die Passwörter stimmen nicht überein.'
  }

  const valid = warnMessage === null

  return (
    <ChangePasswordForm
      currentPassword={currentPassword}
      setCurrentPassword={setCurrentPassword}
      newPassword={newPassword}
      setNewPassword={setNewPassword}
      repeatNewPassword={repeatNewPassword}
      setRepeatNewPassword={setRepeatNewPassword}
      submitDisabled={!valid}
      warnMessage={isDirty ? warnMessage : null}
      loading={loading}
      submit={submit}
    />
  )
}

export default UserSettingsController
