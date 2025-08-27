import { Alert, AlertColor, AlertTitle, Button } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

type AlertBoxProps = {
  severity?: AlertColor
  title?: string
  description?: string | ReactElement
  onAction?: () => void
  actionButtonLabel?: string
  borderless?: boolean
}

const AlertBox = ({
  severity = 'success',
  title,
  description,
  onAction,
  actionButtonLabel,
  borderless = false,
}: AlertBoxProps): ReactElement => {
  const { t } = useTranslation('errors')

  return (
    <Alert
      data-testid='alert-box'
      severity={severity}
      variant='outlined'
      sx={theme => ({
        margin: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '900px',
        border: borderless ? 'none' : undefined,
        [theme.breakpoints.down('md')]: {
          margin: '5px',
        },
      })}
      action={
        onAction ? (
          <Button variant='outlined' color='inherit' size='small' onClick={() => onAction()}>
            {actionButtonLabel || t('retry')}
          </Button>
        ) : undefined
      }>
      {title !== undefined && <AlertTitle sx={{ margin: 0 }}>{title}</AlertTitle>}
      {description}
    </Alert>
  )
}

export default AlertBox
