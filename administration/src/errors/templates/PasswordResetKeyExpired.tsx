import React, { ReactElement } from 'react'

const PasswordResetKeyExpired = (): ReactElement => (
  <>
    Unter folgendem Link können Sie Ihr Passwort erneut zurücksetzen und erhalten einen neuen Link.
    <a href={`${window.location.origin}/forgot-password`} target='_blank' rel='noreferrer'>
      {`${window.location.origin}/forgot-password`}
    </a>
  </>
)
export default PasswordResetKeyExpired
