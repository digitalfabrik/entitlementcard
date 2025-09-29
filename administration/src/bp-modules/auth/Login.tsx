import { Card, Typography } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { SignInMutation, SignInPayload, useSignInMutation } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { useAppToaster } from '../AppToaster'
import StandaloneCenter from '../StandaloneCenter'
import ProjectSwitcher from '../util/ProjectSwitcher'
import LoginForm from './LoginForm'

type State = {
  email: string
  password: string
}

const Login = ({ onSignIn }: { onSignIn: (payload: SignInPayload) => void }): ReactElement => {
  const config = useContext(ProjectConfigContext)
  const appToaster = useAppToaster()
  const { t } = useTranslation('auth')
  const [state, setState] = React.useState<State>({ email: '', password: '' })
  const [signIn, mutationState] = useSignInMutation({
    onCompleted: (payload: SignInMutation) => onSignIn(payload.signInPayload),
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
      <Card sx={{ width: '100%', maxWidth: '500px', padding: 3 }}>
        {/* TODO Setup Typography and remove custom fontSizes and fontHeights https://github.com/digitalfabrik/entitlementcard/issues/2334 */}
        <Typography variant='h2' fontSize={28} fontWeight={600} marginBottom={1}>
          {config.name}
        </Typography>
        <Typography variant='h3' fontSize={22} fontWeight={600}>
          {t('administration')}
        </Typography>
        <Typography variant='h4' fontSize={18} fontWeight={600}>
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
