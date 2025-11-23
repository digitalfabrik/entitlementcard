import { OperationVariables, QueryResult } from '@apollo/client'
import { ReactElement } from 'react'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import AlertBox from '../base/AlertBox'
import CenteredCircularProgress from '../base/CenteredCircularProgress'

type QueryHandlerResult<Data> =
  | {
      successful: true
      data: Data
    }
  | {
      successful: false
      component: ReactElement
    }

const getQueryResult = <Data, Variables extends OperationVariables>(
  queryResult: QueryResult<Data, Variables>,
  errorComponent?: ReactElement
): QueryHandlerResult<Data> => {
  const { error, loading, data, refetch } = queryResult
  if (loading) {
    return { successful: false, component: <CenteredCircularProgress /> }
  }
  if (error) {
    const { title, description, retryable } = getMessageFromApolloError(error)
    return {
      successful: false,
      component: errorComponent ?? (
        <AlertBox title={title} description={description} onAction={retryable ? refetch : undefined} severity='error' />
      ),
    }
  }
  if (data === undefined) {
    return { successful: false, component: <AlertBox onAction={refetch} severity='error' /> }
  }
  return { successful: true, data }
}

export default getQueryResult
