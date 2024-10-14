import { Button, NonIdealState } from '@blueprintjs/core'
import React, { ReactElement } from 'react'

type ErrorHandlerProps = {
  title?: string
  description?: string | ReactElement
  refetch: () => void
}

const ErrorHandler = ({
  refetch,
  title = 'Ein Fehler ist aufgetreten.',
  description,
}: ErrorHandlerProps): ReactElement => (
  <NonIdealState
    icon='error'
    title={title}
    description={description}
    action={<Button onClick={() => refetch()}>Erneut Versuchen</Button>}
  />
)

export default ErrorHandler
