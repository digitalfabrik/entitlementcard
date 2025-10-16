import { Box, Button, Card, TextField, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useSendResetMailMutation } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import StandaloneCenter from '../StandaloneCenter'

const ForgotPasswordController = (): ReactElement => {
  const config = useContext(ProjectConfigContext)
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation('auth')
  const [finished, setFinished] = useState(false)
  const [email, setEmail] = useState('')

  const [sendResetMail, { loading }] = useSendResetMailMutation({
    onCompleted: () => setFinished(true),
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      enqueueSnackbar(title, { variant: 'error' })
    },
  })

  const submit = () =>
    sendResetMail({
      variables: {
        project: config.projectId,
        email,
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
        <Typography variant='h6' component='h3'>
          {t('forgotPassword')}
        </Typography>
        {finished ? (
          <>
            <Typography variant='body2' component='p'>
              {t('resetPasswordSuccessMessage', { email })}
            </Typography>
            <Typography variant='body2' component='p'>
              {t('checkSpamHint')}
            </Typography>
            <Box sx={{ marginTop: 3 }}>
              <Button href='/' variant='text'>
                {t('toLogin')}
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant='body2' marginY={2}>
              {t('resetPasswordText')}
            </Typography>
            <form
              onSubmit={e => {
                e.preventDefault()
                submit()
              }}>
              <TextField
                value={email}
                fullWidth
                size='small'
                label={t('eMail')}
                required
                onChange={e => setEmail(e.target.value)}
                type='email'
                placeholder='erika.musterfrau@example.org'
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 3 }}>
                <Button href='/' variant='text'>
                  {t('backToLogin')}
                </Button>
                <Button type='submit' variant='contained' color='primary' loading={loading} disabled={email === ''}>
                  {t('resetPassword')}
                </Button>
              </Box>
            </form>
          </>
        )}
      </Card>
    </StandaloneCenter>
  )
}

export default ForgotPasswordController
