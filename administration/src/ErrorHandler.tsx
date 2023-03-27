import { Button, Card, Typography } from '@mui/material'
import React, { ReactElement, ReactNode } from 'react'
import { styled } from '@mui/system'

type ErrorHandlerProps = {
  title?: string
  description?: string | ReactNode
  refetch: () => void
}

const ErrorContainer = styled(Card)`
  padding: 20px;
`

const ErrorHandler = ({
  refetch,
  title = 'Ein Fehler ist aufgetreten.',
  description,
}: ErrorHandlerProps): ReactElement => {
  return (
    <ErrorContainer>
      <Typography variant='h6'>{title}</Typography>
      <Typography my='8px' variant='body1' component='div'>
        {description}
      </Typography>
      <Button color='primary' variant='contained' onClick={() => refetch()}>
        Erneut versuchen
      </Button>
    </ErrorContainer>
  )
}

export default ErrorHandler
