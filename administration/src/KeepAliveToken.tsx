import { CheckCircleOutline, Close } from '@mui/icons-material'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, ReactNode, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useWhoAmI } from './WhoAmIProvider'
import PasswordInput from './bp-modules/PasswordInput'
import getMessageFromApolloError from './errors/getMessageFromApolloError'
import { type SignInPayload, useSignInMutation } from './generated/graphql'
import { ProjectConfigContext } from './project-configs/ProjectConfigContext'

const computeSecondsRemaining = (expiresAt: Date) => Math.round((expiresAt.valueOf() - Date.now()) / 1000)
const openAtRemainingSeconds = 180

const KeepAliveToken = ({
  expiresAt,
  onSignOut,
  onSignIn,
  children,
}: {
  expiresAt: Date
  children: ReactNode
  onSignIn: (payload: SignInPayload) => void
  onSignOut: () => void
}): ReactElement => {
  const { t } = useTranslation('auth')
  const projectId = useContext(ProjectConfigContext).projectId
  const email = useWhoAmI().me.email
  const [secondsLeft, setSecondsLeft] = useState(computeSecondsRemaining(expiresAt))
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
    setSecondsLeft(computeSecondsRemaining(expiresAt))

    const interval = setInterval(() => {
      const secondsRemaining = computeSecondsRemaining(expiresAt)
      setSecondsLeft(Math.max(secondsRemaining, 0))

      if (secondsRemaining <= 0) {
        onSignOut()
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [expiresAt, onSignOut])

  return (
    <>
      {children}
      <Dialog open={secondsLeft <= openAtRemainingSeconds} aria-describedby='keep-alive-dialog' fullWidth>
        <DialogTitle>{t('loginPeriodExpires')}</DialogTitle>
        <DialogContent id='keep-alive-dialog'>
          <Stack>
            <Typography component='p'>{t('loginPeriodSecondsLeft', { secondsLeft })}</Typography>
            <Typography component='p'>{t('loginPeriodPasswordPrompt')}</Typography>
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
            onClick={() => signIn({ variables: { project: projectId, authData: { email, password } } })}
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
