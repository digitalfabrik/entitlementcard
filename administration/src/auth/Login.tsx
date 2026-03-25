import { Card, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'urql'

import PageLayout from '../components/PageLayout'
import ProjectSwitcher from '../components/ProjectSwitcher'
import { messageFromGraphQlError } from '../errors'
import { SignInDocument, SignInPayload } from '../graphql'
import { ProjectConfigContext } from '../provider/ProjectConfigContext'
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
  const [signInState, signInMutation] = useMutation(SignInDocument)

  const onSubmit = async () => {
    const result = await signInMutation({
      project: config.projectId,
      authData: { email: state.email, password: state.password },
    })
    if (result.error) {
      const { title } = messageFromGraphQlError(result.error)
      enqueueSnackbar(title, { variant: 'error' })
    } else if (result.data) {
      onSignIn(result.data.signInPayload)
    }
  }

  return (
    <PageLayout
      containerSx={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
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
          loading={signInState.fetching}
        />
        <ProjectSwitcher />
      </Card>
    </PageLayout>
  )
}

export default Login
