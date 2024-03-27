import { Card, H2, H3, H4 } from '@blueprintjs/core'
import React, { useContext } from 'react'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { SignInMutation, SignInPayload, useSignInMutation } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { useAppToaster } from '../AppToaster'
import StandaloneCenter from '../StandaloneCenter'
import ProjectSwitcher from '../util/ProjectSwitcher'
import LoginForm from './LoginForm'

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
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
  })
  const onSubmit = () =>
    signIn({
      variables: {
        project: config.projectId,
        authData: { email: state.email, password: state.password },
      },
    })

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
        <ProjectSwitcher />
      </Card>
    </StandaloneCenter>
  )
}

export default Login
