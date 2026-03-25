import { CheckCircleOutline, Close } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Temporal } from 'temporal-polyfill'
import { useMutation } from 'urql'

import PasswordInput from '../components/PasswordInput'
import { messageFromGraphQlError } from '../errors'
import { SignInDocument, type SignInPayload } from '../graphql'
import { ProjectConfigContext } from '../provider/ProjectConfigContext'
import { useWhoAmI } from '../provider/WhoAmIProvider'

const computeSecondsRemaining = (expiresAt: Temporal.Instant) =>
  Temporal.Now.instant().until(expiresAt, { roundingMode: 'ceil', largestUnit: 'second' }).seconds

const openAtRemainingSeconds = 180

const AutomaticLogoutDialog = ({
  expiresAt,
  onSignOut,
  onSignIn,
}: {
  expiresAt: Temporal.Instant
  onSignIn: (payload: SignInPayload) => void
  onSignOut: () => void
}): ReactElement => {
  const { t } = useTranslation('auth')
  const projectId = useContext(ProjectConfigContext).projectId
  const email = useWhoAmI().me.email
  const [secondsLeft, setSecondsLeft] = useState(computeSecondsRemaining(expiresAt))
  const { enqueueSnackbar } = useSnackbar()
  const [password, setPassword] = useState<string>('')
  const [signInState, signInMutation] = useMutation(SignInDocument)

  useEffect(() => {
    const interval = setInterval(() => {
      const secondsRemaining = computeSecondsRemaining(expiresAt)
      setSecondsLeft(Math.max(secondsRemaining, 0))

      if (secondsRemaining <= 0) {
        onSignOut()
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [expiresAt, onSignOut])

  if (signInState.data) {
    enqueueSnackbar(t('loginPeriodExtended'), { variant: 'success' })
    onSignIn(signInState.data.signInPayload)
    setPassword('')
  } else if (signInState.error) {
    const { title } = messageFromGraphQlError(signInState.error)
    enqueueSnackbar(title, { variant: 'error' })
  }

  return (
    <Dialog
      open={secondsLeft <= openAtRemainingSeconds}
      aria-describedby='keep-alive-dialog'
      fullWidth
    >
      <DialogTitle>{t('loginPeriodExpires')}</DialogTitle>
      <DialogContent id='keep-alive-dialog'>
        <Stack>
          <Typography component='p'>{t('loginPeriodSecondsLeft', { secondsLeft })}</Typography>
          <Typography component='p'>{t('loginPeriodPasswordPrompt')}</Typography>
          <PasswordInput
            placeholder={t('loginPeriodPasswordPlaceholder')}
            setValue={setPassword}
            value={password}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ paddingLeft: 3, paddingRight: 3, paddingBottom: 3 }}>
        <Button
          variant='outlined'
          startIcon={<Close />}
          onClick={onSignOut}
          loading={signInState.fetching}
        >
          {t('loginPeriodLogoutButton')}
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={() => signInMutation({ project: projectId, authData: { email, password } })}
          startIcon={<CheckCircleOutline />}
          loading={signInState.fetching}
        >
          {t('loginPeriodExtendButton')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AutomaticLogoutDialog
