import React, { ReactElement } from 'react'

import { isEmailValid } from './applications/utils/verificationHelper'

export const EmailLink = (email: string): ReactElement =>
  isEmailValid(email) ? <a href={`mailto:${email}`}> {email}</a> : <span>{email}</span>
