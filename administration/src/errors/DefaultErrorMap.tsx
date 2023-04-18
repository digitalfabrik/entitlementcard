import { ReactElement } from 'react'

import { GraphQlExceptionCode } from '../generated/graphql'
import InvalidLink from './templates/InvalidLink'
import PasswordResetKeyExpired from './templates/PasswordResetKeyExpired'

type GraphQLErrorMessage = {
  title: string
  description?: string | ReactElement
}
const defaultErrorMap: Record<GraphQlExceptionCode, GraphQLErrorMessage> = {
  EMAIL_ALREADY_EXISTS: {
    title: 'Die Email-Adresse wird bereits verwendet.',
  },
  INVALID_LINK: {
    title: 'Ihr Link ist ungültig',
    description: <InvalidLink />,
  },
  INVALID_CREDENTIALS: {
    title: 'Der Login ist fehlgeschlagen.',
  },
  INVALID_CODE_TYPE: {
    title: 'Diese Kombination aus Karte und Kartentyp (statisch/dynamisch) existiert nicht.',
  },
  INVALID_FILE_TYPE: {
    title: 'Dieser Dateityp wird nicht unterstützt.',
  },
  INVALID_FILE_SIZE: {
    title: 'Die Datei ist zu groß.',
  },
  INVALID_JSON: {
    title: 'Daten konnten nicht geparsed werden.',
  },
  INVALID_PASSWORD: {
    title: 'Kein gültiges Passwort.',
  },
  INVALID_ROLE: {
    title: 'Diese Rolle kann nicht zugewiesen werden.',
  },
  MAIL_NOT_SENT: {
    title: 'Email konnte nicht gesendet werden.',
  },
  PASSWORD_RESET_KEY_EXPIRED: {
    title: 'Die Gültigkeit ihres Links ist abgelaufen',
    description: <PasswordResetKeyExpired />,
  },
  REGION_NOT_FOUND: {
    title: 'Diese Region existiert nicht.',
  },
}

export default defaultErrorMap
