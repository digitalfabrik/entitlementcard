import { ApolloError } from '@apollo/client'
import { ReactElement } from 'react'

import defaultErrorMap from './defaultErrorMap'
import graphQlErrorMap from './graphQlErrorMap'

export type GraphQLErrorMessage = {
  title: string
  description?: string | ReactElement
  retryable?: boolean
}

const getMessageFromApolloError = (error: ApolloError): GraphQLErrorMessage => {
  const codesEqual = error.graphQLErrors.every(
    (value, index, array) => value.extensions!.code === array[0].extensions!.code,
  )
  if (error.graphQLErrors.length < 1 || (error.graphQLErrors.length > 1 && !codesEqual)) {
    return defaultErrorMap(error)
  }

  return graphQlErrorMap(error.graphQLErrors[0].extensions)
}

export default getMessageFromApolloError
