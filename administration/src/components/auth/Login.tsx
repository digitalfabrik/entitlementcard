import React, { useContext } from 'react'
import styled from 'styled-components'
import LoginForm from './LoginForm'
import { useAppToaster } from '../AppToaster'
import { Card, H2, H3, H4 } from '@blueprintjs/core'
import { SignInMutation, SignInPayload, useSignInMutation } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'


const Center = styled('div')`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

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

  return (
    <Center>
      <Card>
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
      </Card>
    </Center>
  )
}

export default Login
