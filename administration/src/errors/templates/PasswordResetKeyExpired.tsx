import { Link } from '@mui/material'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

const PasswordResetKeyExpired = (): ReactElement => {
  const { t } = useTranslation('errorTemplates')
  return (
    <>
      {t('passwordResetKeyExpired')}
      <Link href='/forgot-password' target='_blank' rel='noreferrer'>
        {`${window.location.origin}/forgot-password`}
      </Link>
    </>
  )
}
export default PasswordResetKeyExpired
