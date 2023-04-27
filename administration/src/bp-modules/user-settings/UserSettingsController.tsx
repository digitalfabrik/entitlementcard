import React, { useContext, useState } from 'react'

import { WhoAmIContext } from '../../WhoAmIProvider'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useChangePasswordMutation } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { useAppToaster } from '../AppToaster'
import validatePasswordInput from '../auth/validateNewPasswordInput'
import ApplicationLinkCard from './ApplicationLinkCard'
import ChangePasswordForm from './ChangePasswordForm'

const UserSettingsController = () => {
  const { applicationFeatureEnabled } = useContext(ProjectConfigContext)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatNewPassword, setRepeatNewPassword] = useState('')

  const project = useContext(ProjectConfigContext).projectId
  const email = useContext(WhoAmIContext).me!.email

  const appToaster = useAppToaster()
  const [changePassword, { loading }] = useChangePasswordMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
    onCompleted: () => {
      appToaster?.show({
        intent: 'success',
        message: 'Passwort erfolgreich geändert.',
      })
      setCurrentPassword('')
      setNewPassword('')
      setRepeatNewPassword('')
    },
  })

  const submit = async () =>
    changePassword({
      variables: {
        newPassword,
        currentPassword,
        email,
        project,
      },
    })

  const isDirty = newPassword !== '' || repeatNewPassword !== ''

  const warnMessage: string | null = validatePasswordInput(newPassword, repeatNewPassword)

  const valid = warnMessage === null

  return (
    <>
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
      {/* TODO #897: [Application] Remove Redirect for bayern */}
      {applicationFeatureEnabled && <ApplicationLinkCard />}
    </>
  )
}

export default UserSettingsController
