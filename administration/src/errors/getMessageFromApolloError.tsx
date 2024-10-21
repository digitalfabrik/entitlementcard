import { ApolloError } from '@apollo/client'
import { ReactElement } from 'react'

import defaultErrorMap from './DefaultErrorMap'

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
    (value, index, array) => value.extensions!.code === array[0].extensions!.code
  )
  if (error.graphQLErrors.length < 1 || (error.graphQLErrors.length > 1 && !codesEqual)) {
    return { title: defaultMessage }
  }

  return defaultErrorMap(error.graphQLErrors[0].extensions)
}

export default getMessageFromApolloError
