import { Button, NonIdealState } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

type ErrorHandlerProps = {
  title?: string
  description?: string | ReactElement
  refetch: () => void
}

const ErrorHandler = ({
  refetch,
  title = 'Ein Fehler ist aufgetreten.',
  description,
}: ErrorHandlerProps): ReactElement => {
  const { t } = useTranslation('errors')
  return (
    <NonIdealState
      icon='error'
      title={title}
      description={description}
      action={<Button onClick={() => refetch()}>{t('retry')}</Button>}
    />
  )
}

export default ErrorHandler
