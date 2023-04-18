import { OperationVariables, QueryResult } from '@apollo/client'
import { Spinner } from '@blueprintjs/core'
import { ReactElement } from 'react'

import getMessageFromApolloError, { OverwriteError } from '../../errors/getMessageFromApolloError'
import ErrorHandler from '../ErrorHandler'

type QueryHandlerResult<Data> =
  | {
      successful: true
      data: Data
    }
  | {
      successful: false
      component: ReactElement
    }

const useQueryHandler = <Data, Variables extends OperationVariables>(
  queryResult: QueryResult<Data, Variables>,
  overwriteError?: OverwriteError
): QueryHandlerResult<Data> => {
  const { error, loading, data, refetch } = queryResult

  if (loading) return { successful: false, component: <Spinner /> }
  if (error) {
    const { title, description } = getMessageFromApolloError(error, overwriteError)
    return { successful: false, component: <ErrorHandler title={title} description={description} refetch={refetch} /> }
  }
  if (!data) return { successful: false, component: <ErrorHandler refetch={refetch} /> }
  return { successful: true, data: data }
}

export default useQueryHandler
