import React, { useContext, useState } from 'react'
import { useChangePasswordMutation } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { AuthContext } from '../../AuthProvider'
import { useAppToaster } from '../AppToaster'
import ChangePasswordForm from './ChangePasswordForm'
import validatePasswordInput from "../auth/validateNewPasswordInput";

const UserSettingsController = () => {
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

  let warnMessage: string | null = validatePasswordInput(newPassword, repeatNewPassword)

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
