import { ApolloError } from '@apollo/client'

const getMessageFromApolloError = (error: ApolloError): string => {
  const defaultMessage = 'Etwas ist schief gelaufen.'
  if (error.graphQLErrors.length !== 1) {
    return defaultMessage
  }
  const graphQLError = error.graphQLErrors[0]
  if ('code' in graphQLError.extensions) {
    switch (graphQLError.extensions['code']) {
      case 'EMAIL_ALREADY_EXISTS':
        return 'Die Email-Adresse wird bereits verwendet.'
    }
  }
  return defaultMessage
}

export default getMessageFromApolloError
