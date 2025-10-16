import { CheckCircleOutline, Close } from '@mui/icons-material'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, ReactNode, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { TokenPayload } from './AuthProvider'
import { useWhoAmI } from './WhoAmIProvider'
import PasswordInput from './bp-modules/PasswordInput'
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
  const { enqueueSnackbar } = useSnackbar()
  const [password, setPassword] = useState<string>('')
  const [signIn, mutationState] = useSignInMutation({
    onCompleted: payload => {
      enqueueSnackbar(t('loginPeriodExtended'), { variant: 'success' })
      onSignIn(payload.signInPayload)
      setPassword('')
    },
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      enqueueSnackbar(title, { variant: 'error' })
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

  const extendLogin = () => signIn({ variables: { project: projectId, authData: { email, password } } })

  return (
    <>
      {children}
      <Dialog open={secondsLeft <= 180} aria-describedby='keep-alive-dialog' fullWidth>
        <DialogTitle>{t('loginPeriodExpires')}</DialogTitle>
        <DialogContent id='keep-alive-dialog'>
          <Stack>
            <Typography component='p' variant='body2'>
              {t('loginPeriodSecondsLeft', { secondsLeft })}
            </Typography>
            <Typography component='p' variant='body2'>
              {t('loginPeriodPasswordPrompt')}
            </Typography>
            <PasswordInput placeholder={t('loginPeriodPasswordPlaceholder')} setValue={setPassword} value={password} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ paddingLeft: 3, paddingRight: 3, paddingBottom: 3 }}>
          <Button variant='outlined' startIcon={<Close />} onClick={onSignOut} loading={mutationState.loading}>
            {t('loginPeriodLogoutButton')}
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={extendLogin}
            startIcon={<CheckCircleOutline />}
            loading={mutationState.loading}>
            {t('loginPeriodExtendButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default KeepAliveToken
