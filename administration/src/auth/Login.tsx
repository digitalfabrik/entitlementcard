import { Card, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import getMessageFromApolloError from '../errors/getMessageFromApolloError'
import { SignInMutation, SignInPayload, useSignInMutation } from '../generated/graphql'
import { ProjectConfigContext } from '../project-configs/ProjectConfigContext'
import ProjectSwitcher from '../shared/components/ProjectSwitcher'
import StandaloneCenter from '../shared/components/StandaloneCenter'
import LoginForm from './LoginForm'

type State = {
  email: string
  password: string
}

const Login = ({ onSignIn }: { onSignIn: (payload: SignInPayload) => void }): ReactElement => {
  const config = useContext(ProjectConfigContext)
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation('auth')
  const [state, setState] = React.useState<State>({ email: '', password: '' })
  const [signIn, mutationState] = useSignInMutation({
    onCompleted: (payload: SignInMutation) => onSignIn(payload.signInPayload),
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      enqueueSnackbar(title, { variant: 'error' })
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
      <Card sx={{ width: '100%', maxWidth: '500px', padding: 3 }}>
        <Typography variant='h4' component='h1'>
          {config.name}
        </Typography>
        <Typography variant='h5' component='h2'>
          {t('administration')}
        </Typography>
        <Typography variant='h6' component='h3' marginBottom={3}>
          {t('login')}
        </Typography>
        <LoginForm
          password={state.password}
          email={state.email}
          setEmail={email => setState({ ...state, email })}
          setPassword={password => setState({ ...state, password: password ?? '' })}
          onSubmit={onSubmit}
          loading={mutationState.loading}
        />
        <ProjectSwitcher />
      </Card>
    </StandaloneCenter>
  )
}

export default Login
