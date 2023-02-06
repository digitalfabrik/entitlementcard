import React, { useContext } from 'react'
import LoginForm from './LoginForm'
import { useAppToaster } from '../AppToaster'
import { Button, Card, H2, H3, H4 } from '@blueprintjs/core'
import { SignInMutation, SignInPayload, useSignInMutation } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import StandaloneCenter from '../StandaloneCenter'
import { setProjectConfigOverride } from '../../project-configs/getProjectConfig'

interface State {
  email: string
  password: string
}

const Login = (props: { onSignIn: (payload: SignInPayload) => void }) => {
  const config = useContext(ProjectConfigContext)
  const appToaster = useAppToaster()
  const [state, setState] = React.useState<State>({ email: '', password: '' })
  const [signIn, mutationState] = useSignInMutation({
    onCompleted: (payload: SignInMutation) => props.onSignIn(payload.signInPayload),
    onError: () => appToaster?.show({ intent: 'danger', message: 'Login fehlgeschlagen.' }),
  })
  const onSubmit = () =>
    signIn({
      variables: {
        project: config.projectId,
        authData: { email: state.email, password: state.password },
      },
    })

  console.log(process.env.NODE_ENV)

  return (
    <StandaloneCenter>
      <Card style={{ width: '100%', maxWidth: '500px' }}>
        <H2>{config.name}</H2>
        <H3>Verwaltung</H3>
        <H4>Login</H4>
        <LoginForm
          password={state.password}
          email={state.email}
          setEmail={email => setState({ ...state, email })}
          setPassword={password => setState({ ...state, password })}
          onSubmit={onSubmit}
          loading={mutationState.loading}
        />
        {process.env.NODE_ENV === 'development' ? (
          <>
            <Button onClick={() => setProjectConfigOverride('nuernberg.sozialpass.app')}>Switch to Nürnberg</Button>
            <Button onClick={() => setProjectConfigOverride('bayern.ehrenamtskarte.app')}>
              Switch to Ehrenamtskarte Bayern
            </Button>
          </>
        ) : null}
      </Card>
    </StandaloneCenter>
  )
}

export default Login
