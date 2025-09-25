import { CheckCircleOutline, Close } from '@mui/icons-material'
import { Button, Stack } from '@mui/material'
import React, { ReactElement, ReactNode, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { TokenPayload } from './AuthProvider'
import { useWhoAmI } from './WhoAmIProvider'
import { useAppToaster } from './bp-modules/AppToaster'
import PasswordInput from './bp-modules/PasswordInput'
import CustomDialog from './bp-modules/components/CustomDialog'
import getMessageFromApolloError from './errors/getMessageFromApolloError'
import { SignInPayload, useSignInMutation } from './generated/graphql'
import { ProjectConfigContext } from './project-configs/ProjectConfigContext'

type Props = {
  authData: TokenPayload
  children: ReactNode
  onSignIn: (payload: SignInPayload) => void
  onSignOut: () => void
}

const computeSecondsLeft = (authData: TokenPayload) => Math.round((authData.expiry.valueOf() - Date.now()) / 1000)

const KeepAliveToken = ({ authData, onSignOut, onSignIn, children }: Props): ReactElement => {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const projectId = useContext(ProjectConfigContext).projectId
  const email = useWhoAmI().me.email
  const [secondsLeft, setSecondsLeft] = useState(computeSecondsLeft(authData))
  const appToaster = useAppToaster()
  const [password, setPassword] = useState<string>()
  const [signIn, mutationState] = useSignInMutation({
    onCompleted: payload => {
      appToaster?.show({ intent: 'success', message: t('loginPeriodExtended') })
      onSignIn(payload.signInPayload)
      setPassword('')
    },
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
  })

  useEffect(() => {
    setSecondsLeft(computeSecondsLeft(authData))
    const interval = setInterval(() => {
      const timeLeft = computeSecondsLeft(authData)
      setSecondsLeft(Math.max(timeLeft, 0))
      if (timeLeft <= 0) {
        onSignOut()
        navigate('/')
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [authData, onSignOut, navigate])

  const extendLogin = () => signIn({ variables: { project: projectId, authData: { email, password: password ?? '' } } })

  return (
    <>
      {children}
      <CustomDialog
        open={secondsLeft <= 180}
        title={t('loginPeriodExpires')}
        id='keep-alive-dialog'
        onConfirmAction={
          <Button
            variant='contained'
            color='primary'
            onClick={extendLogin}
            startIcon={<CheckCircleOutline />}
            loading={mutationState.loading}>
            {t('loginPeriodExtendButton')}
          </Button>
        }
        onCancelAction={
          <Button
            variant='outlined'
            color='default.dark'
            startIcon={<Close />}
            onClick={onSignOut}
            loading={mutationState.loading}>
            {t('loginPeriodLogoutButton')}
          </Button>
        }>
        <Stack>
          <p>{t('loginPeriodSecondsLeft', { secondsLeft })}</p>
          <p>{t('loginPeriodPasswordPrompt')}</p>
          <PasswordInput placeholder={t('loginPeriodPasswordPlaceholder')} setValue={setPassword} value={password} />
        </Stack>
      </CustomDialog>
    </>
  )
}

export default KeepAliveToken
