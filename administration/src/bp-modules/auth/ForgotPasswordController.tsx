import { Box, Button, Card, FormControl, FormLabel, TextField, Typography } from '@mui/material'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useSendResetMailMutation } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { useAppToaster } from '../AppToaster'
import StandaloneCenter from '../StandaloneCenter'

const ForgotPasswordController = (): ReactElement => {
  const config = useContext(ProjectConfigContext)
  const appToaster = useAppToaster()
  const { t } = useTranslation('auth')
  const [finished, setFinished] = useState(false)
  const [email, setEmail] = useState('')

  const [sendResetMail, { loading }] = useSendResetMailMutation({
    onCompleted: () => setFinished(true),
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({
        intent: 'danger',
        message: title,
      })
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
        {/* TODO Setup Typography and remove custom fontSizes and fontHeights https://github.com/digitalfabrik/entitlementcard/issues/2334 */}
        <Typography variant='h2' fontSize={28} fontWeight={600} marginBottom={1}>
          {config.name}
        </Typography>
        <Typography variant='h3' fontSize={22} fontWeight={600}>
          {t('administration')}
        </Typography>
        <Typography variant='h4' fontSize={18} fontWeight={600} marginBottom={2}>
          {t('forgotPassword')}
        </Typography>
        {finished ? (
          <>
            <Typography variant='body2'>{t('resetPasswordSuccessMessage', { email })}</Typography>
            <Typography variant='body2'>{t('checkSpamHint')}</Typography>
            <Box sx={{ marginTop: 3 }}>
              <Link to='/'>
                <Button variant='text'>{t('toLogin')}</Button>
              </Link>
            </Box>
          </>
        ) : (
          <>
            <Typography variant='body2' marginBottom={2}>
              {t('resetPasswordText')}
            </Typography>
            <form
              onSubmit={e => {
                e.preventDefault()
                submit()
              }}>
              <FormControl fullWidth>
                <FormLabel>{t('eMail')}</FormLabel>
                <TextField
                  value={email}
                  size='small'
                  onChange={e => setEmail(e.target.value)}
                  type='email'
                  placeholder='erika.musterfrau@example.org'
                />
              </FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 3 }}>
                <Link to='/'>
                  <Button variant='text'>{t('backToLogin')}</Button>
                </Link>
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
