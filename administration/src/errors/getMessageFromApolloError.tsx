import { ApolloError } from '@apollo/client'
import { ReactElement } from 'react'

import { GraphQlExceptionCode } from '../generated/graphql'
import defaultErrorMap from './DefaultErrorMap'

type GraphQLErrorMessage = {
  title: string
  description?: string | ReactElement
}

export type OverwriteError = { [Code in GraphQlExceptionCode]?: GraphQLErrorMessage }

const getMessageFromApolloError = (error: ApolloError, overwriteError: OverwriteError = {}): GraphQLErrorMessage => {
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
  if ('code' in graphQLError.extensions && (graphQLError.extensions['code'] as any) in defaultErrorMap) {
    const code = graphQLError.extensions['code'] as GraphQlExceptionCode

    if (code in overwriteError) {
      return overwriteError[code] ?? { title: defaultMessage }
    }
    return defaultErrorMap[code]
  }
  return { title: defaultMessage }
}

export default getMessageFromApolloError
