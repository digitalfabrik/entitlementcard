import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

const PasswordResetKeyExpired = (): ReactElement => {
  const { t } = useTranslation('errorTemplates')
  return (
    <>
      {t('passwordResetKeyExpired')}
      <Link to='/forgot-password' target='_blank' rel='noreferrer'>
        {`${window.location.origin}/forgot-password`}
      </Link>
    </>
  )
}
export default PasswordResetKeyExpired
