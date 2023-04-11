import { ApolloError } from '@apollo/client'
import { ReactElement } from 'react'

import InvalidLink from './templates/InvalidLink'
import InvalidPasswordResetLink from './templates/InvalidPasswordResetLink'
import PasswordResetKeyExpired from './templates/PasswordResetKeyExpired'

type GraphQLErrorMessage = {
  title: string
  description?: string | ReactElement
}
const getMessageFromApolloError = (error: ApolloError): GraphQLErrorMessage => {
  const defaultMessage = 'Etwas ist schief gelaufen.'

  if (error.networkError) {
    return { title: 'Server nicht erreichbar.' }
  }

  const codesEqual = error.graphQLErrors.every(
    (value, index, array) => value.extensions.code === array[0].extensions.code
  )
  if (error.graphQLErrors.length < 1 || (error.graphQLErrors.length > 1 && !codesEqual)) {
    return { title: defaultMessage }
  }

  const graphQLError = error.graphQLErrors[0]
  if ('code' in graphQLError.extensions) {
    switch (graphQLError.extensions['code']) {
      case 'EMAIL_ALREADY_EXISTS':
        return { title: 'Die Email-Adresse wird bereits verwendet.' }
      case 'PASSWORD_RESET_KEY_EXPIRED':
        return {
          title: 'Die Gültigkeit ihres Links ist abgelaufen',
          description: <PasswordResetKeyExpired />,
        }
      case 'INVALID_LINK':
        return {
          title: 'Ihr Link ist ungültig',
          description: <InvalidLink />,
        }
      case 'INVALID_PASSWORD_RESET_LINK':
        return {
          title: 'Ihr Link ist ungültig',
          description: <InvalidPasswordResetLink />,
        }
    }
  }
  return { title: defaultMessage }
}

export default getMessageFromApolloError
