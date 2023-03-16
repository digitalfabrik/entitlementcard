import { Button, Card, Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { styled } from '@mui/system'

type ErrorHandlerProps = {
  title?: string
  refetch: () => void
}

const ErrorContainer = styled(Card)`
  padding: 20px;
`

const ErrorHandler = ({ refetch, title = 'Ein Fehler ist aufgetreten.' }: ErrorHandlerProps): ReactElement => {
  return (
    <ErrorContainer>
      <Typography variant='h6'>{title}</Typography>
      <Button color='primary' variant='contained' onClick={() => refetch()}>
        Erneut versuchen
      </Button>
    </ErrorContainer>
  )
}

export default ErrorHandler
