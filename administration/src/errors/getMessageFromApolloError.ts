import { ApolloError } from '@apollo/client'
import { TFunction } from 'i18next'
import { ReactElement } from 'react'

import defaultErrorMap from './DefaultErrorMap'
import graphQlErrorMap from './GraphQlErrorMap'

export type GraphQLErrorMessage = {
  title: string
  description?: string | ReactElement
}

const getMessageFromApolloError = (error: ApolloError, t: TFunction): GraphQLErrorMessage => {
  const codesEqual = error.graphQLErrors.every(
    (value, index, array) => value.extensions!.code === array[0].extensions!.code
  )
  if (error.graphQLErrors.length < 1 || (error.graphQLErrors.length > 1 && !codesEqual)) {
    return defaultErrorMap(error)
  }

  return graphQlErrorMap(t, error.graphQLErrors[0].extensions)
}

export default getMessageFromApolloError
