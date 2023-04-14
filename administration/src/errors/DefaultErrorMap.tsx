import { ReactElement } from 'react'
import { GraphQlExceptionCode } from '../generated/graphql'
import InvalidLink from './templates/InvalidLink'
import InvalidPasswordResetLink from './templates/InvalidPasswordResetLink'
import PasswordResetKeyExpired from './templates/PasswordResetKeyExpired'
type GraphQLErrorMessage = {
  title: string
  description?: string | ReactElement
}
const defaultErrorMap: Record<GraphQlExceptionCode, GraphQLErrorMessage>= {
    USER_NOT_FOUND: {
        title: ''
    },
    EMPTY_INPUT: {
        title: ''
    },
    EMAIL_ALREADY_EXISTS: {
        title: 'Die Email-Adresse wird bereits verwendet.'
        },
    TOO_LONG_INPUT: {
        title: ''
    },
    INVALID_LINK: {
        title: 'Ihr Link ist ungültig',
        description: <InvalidLink />,
      },
    INVALID_CREDENTIALS: {
        title: ''
    },
    INVALID_CODE_TYPE: {
        title: ''
    },
    INVALID_DATE_FORMAT: {
        title: ''
    },
    INVALID_FILE_TYPE: {
        title: ''
    },
    INVALID_FILE_SIZE: {
        title: ''
    },
    INVALID_PASSWORD: {
        title: ''
    },
    INVALID_PASSWORD_RESET_LINK: {
        title: 'Ihr Link ist ungültig',
        description: <InvalidPasswordResetLink />,
    },
    INVALID_ROLE: {
        title: ''
    },
    TOO_YOUNG: {
        title: ''
    },
    MAIL_NOT_SENT: {
        title: ''
    },
    PASSWORD_RESET_KEY_EXPIRED: {
        title: 'Die Gültigkeit ihres Links ist abgelaufen',
        description: <PasswordResetKeyExpired />,
      },
    REGION_NOT_FOUND: {
        title: ''
    },
    WRONG_PASSWORD_EXCEPTION: {
        title: ''
    }
}

export default defaultErrorMap