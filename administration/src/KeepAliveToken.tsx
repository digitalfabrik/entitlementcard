import { Button, Classes, Dialog } from '@blueprintjs/core'
import React, { ReactElement, ReactNode, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { TokenPayload } from './AuthProvider'
import { WhoAmIContext } from './WhoAmIProvider'
import { useAppToaster } from './bp-modules/AppToaster'
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
  const navigate = useNavigate()
  const projectId = useContext(ProjectConfigContext).projectId
  const email = useContext(WhoAmIContext).me!.email
  const [secondsLeft, setSecondsLeft] = useState(computeSecondsLeft(authData))
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
  const appToaster = useAppToaster()

  const [password, setPassword] = useState('')

  const [signIn, mutationState] = useSignInMutation({
    onCompleted: payload => {
      appToaster?.show({ intent: 'success', message: 'Login-Zeitraum verlängert.' })
      onSignIn(payload.signInPayload)
      setPassword('')
    },
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
  })
  const extendLogin = () => signIn({ variables: { project: projectId, authData: { email, password } } })

  return (
    <>
      {children}
      <Dialog
        isOpen={secondsLeft <= 180}
        title='Ihr Login-Zeitraum läuft ab!'
        icon='warning-sign'
        isCloseButtonShown={false}>
        <form
          onSubmit={e => {
            e.preventDefault()
            extendLogin()
          }}>
          <div className={Classes.DIALOG_BODY}>
            <p>Ihr Login-Zeitraum läuft in {secondsLeft} Sekunden ab. Danach werden Sie automatisch ausgeloggt.</p>
            <p>Geben Sie Ihr Passwort ein, um den Login-Zeitraum zu verlängern.</p>
            <PasswordInput label='' placeholder='Passwort' setValue={setPassword} value={password} />
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button onClick={onSignOut} loading={mutationState.loading}>
                Ausloggen
              </Button>
              <Button intent='primary' type='submit' loading={mutationState.loading} text='Login-Zeitraum verlängern' />
            </div>
          </div>
        </form>
      </Dialog>
    </>
  )
}

export default KeepAliveToken
