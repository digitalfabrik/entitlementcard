import { Button, Card, Typography } from '@mui/material'
import { styled } from '@mui/system'
import React, { ReactElement } from 'react'

type ErrorHandlerProps = {
  title?: string
  description?: string | ReactElement
  refetch: () => void
}

const ErrorContainer = styled(Card)`
  padding: 20px;
`

const ErrorHandler = ({
  refetch,
  title = 'Ein Fehler ist aufgetreten.',
  description,
}: ErrorHandlerProps): ReactElement => (
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

export default ErrorHandler
