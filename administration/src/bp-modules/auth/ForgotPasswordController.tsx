import { Card, Classes, FormGroup, H2, H3, H4, InputGroup } from '@blueprintjs/core'
import { Button } from '@mui/material'
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
      <Card style={{ width: '100%', maxWidth: '500px' }}>
        <H2>{config.name}</H2>
        <H3>{t('administration')}</H3>
        <H4>{t('forgotPassword')}</H4>
        {finished ? (
          <>
            <p>{t('resetPasswordSuceessMessage', { email })}</p>
            <p>{t('checkSpamHint')}</p>
            <p>
              <Link to='/'>
                <Button variant='text'>{t('toLogin')}</Button>
              </Link>
            </p>
          </>
        ) : (
          <>
            <p>{t('resetPasswordText')}</p>
            <form
              onSubmit={e => {
                e.preventDefault()
                submit()
              }}>
              <FormGroup label={t('eMail')}>
                <InputGroup
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  type='email'
                  placeholder='erika.musterfrau@example.org'
                />
              </FormGroup>
              <div
                className={Classes.DIALOG_FOOTER_ACTIONS}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to='/'>
                  <Button variant='text'>{t('backToLogin')}</Button>
                </Link>
                <Button type='submit' variant='contained' loading={loading} disabled={email === ''}>
                  {t('resetPassword')}
                </Button>
              </div>
            </form>
          </>
        )}
      </Card>
    </StandaloneCenter>
  )
}

export default ForgotPasswordController
