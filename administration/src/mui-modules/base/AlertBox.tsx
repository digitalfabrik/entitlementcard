import { Alert, AlertColor, AlertTitle, Button } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

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
    <Alert
      data-testid='alert-box'
      severity={severity}
      variant='outlined'
      sx={theme => ({
        margin: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '900px',
        [theme.breakpoints.down('md')]: {
          flexDirection: 'column',
          margin: '5px',
          '& .MuiAlert-action': {
            alignSelf: 'start',
            marginLeft: 0,
          },
        },
      })}
      action={
        onAction ? (
          <Button variant='outlined' color='inherit' size='small' onClick={onAction}>
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
