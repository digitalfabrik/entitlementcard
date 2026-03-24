import React, { ReactElement } from 'react'
import { UseQueryExecute, UseQueryState } from 'urql'

import AlertBox from '../components/AlertBox'
import CenteredCircularProgress from '../components/CenteredCircularProgress'
import messageFromGraphQlError from '../errors/getMessageFromApolloError'

type QueryHandlerResult<Data> =
  | {
      successful: true
      data: Data
    }
  | {
      successful: false
      component: ReactElement
    }

const getQueryResult = <Data,>(
  queryState: UseQueryState<Data>,
  reexecute: UseQueryExecute,
  errorComponent?: ReactElement,
): QueryHandlerResult<Data> => {
  const { error, fetching, data } = queryState
  if (fetching) {
    return { successful: false, component: <CenteredCircularProgress /> }
  }
  if (error) {
    const { title, description, retryable } = messageFromGraphQlError(error)
    return {
      successful: false,
      component: errorComponent ?? (
        <AlertBox
          title={title}
          description={description}
          onAction={retryable ? reexecute : undefined}
          severity='error'
        />
      ),
    }
  }
  if (data === undefined) {
    return { successful: false, component: <AlertBox onAction={reexecute} severity='error' /> }
  }
  return { successful: true, data }
}

export default getQueryResult
