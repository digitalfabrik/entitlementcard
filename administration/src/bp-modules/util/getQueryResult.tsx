import { OperationVariables, QueryResult } from '@apollo/client'
import { CircularProgress, Stack } from '@mui/material'
import React, { ReactElement } from 'react'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import ErrorHandler from '../ErrorHandler'

const getQueryResult = <Data, Variables extends OperationVariables>(
  queryResult: QueryResult<Data, Variables>,
  errorComponent?: ReactElement
):
  | {
      successful: true
      data: Data
    }
  | {
      successful: false
      component: ReactElement
    } => {
  const { error, loading, data, refetch } = queryResult

  if (loading) {
    return {
      successful: false,
      component: (
        <Stack sx={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress size='3rem' />
        </Stack>
      ),
    }
  }
  if (error) {
    const { title, description } = getMessageFromApolloError(error)
    return {
      successful: false,
      component: errorComponent ?? <ErrorHandler title={title} description={description} refetch={refetch} />,
    }
  }
  if (data === undefined) {
    return { successful: false, component: <ErrorHandler refetch={refetch} /> }
  }
  return { successful: true, data }
}

export default getQueryResult
