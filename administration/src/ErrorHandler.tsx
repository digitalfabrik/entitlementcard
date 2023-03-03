import { Button, Card, H3 } from '@blueprintjs/core'
import React, { ReactElement } from 'react'

type ErrorHandlerProps = {
  title?: string
  refetch: () => void
}

const ErrorHandler = ({ refetch, title = 'Ein Fehler ist aufgetreten.' }: ErrorHandlerProps): ReactElement => {
  return (
    <Card>
      <H3>{title}</H3>
      <Button intent='primary' onClick={() => refetch()}>
        Erneut versuchen
      </Button>
    </Card>
  )
}

export default ErrorHandler
