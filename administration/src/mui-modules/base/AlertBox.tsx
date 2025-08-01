import { Alert, AlertColor, AlertTitle, Button, styled } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

const CenteredAlert = styled(Alert)`
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`

type AlertBoxProps = {
  severity?: AlertColor
  title?: string
  description?: string | ReactElement
  onAction?: () => void
  actionButtonLabel?: string
}

const AlertBox = ({
  severity = 'success',
  title,
  description,
  onAction,
  actionButtonLabel,
}: AlertBoxProps): ReactElement => {
  const { t } = useTranslation('errors')

  return (
    <CenteredAlert
      data-testid='alert-box'
      severity={severity}
      variant='outlined'
      action={
        onAction ? (
          <Button color='inherit' size='small' onClick={onAction}>
            {actionButtonLabel || t('retry')}
          </Button>
        ) : undefined
      }>
      {title !== undefined && <AlertTitle sx={{ margin: 0 }}>{title}</AlertTitle>}
      {description}
    </CenteredAlert>
  )
}

export default AlertBox
