import { Alert, AlertColor, AlertTitle, Button, SxProps } from '@mui/material'
import { Theme } from '@mui/system'
import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type AlertBoxProps = {
  customIcon?: ReactNode
  sx?: SxProps<Theme>
  severity?: AlertColor
  title?: string
  description?: string | ReactElement
  fullWidth?: boolean
  onAction?: () => void
  actionButtonLabel?: string
}

const AlertBox = ({
  sx,
  customIcon,
  severity = 'success',
  title,
  fullWidth = false,
  description,
  onAction,
  actionButtonLabel,
}: AlertBoxProps): ReactElement => {
  const { t } = useTranslation('errors')
  const fullWidthStyles = fullWidth ? { margin: 0, maxWidth: 'none' } : {}

  return (
    <Alert
      data-testid='alert-box'
      severity={severity}
      icon={customIcon}
      variant='outlined'
      sx={{
        margin: 'auto',
        display: 'flex',
        justifyContent: 'flex-start',
        maxWidth: '900px',
        '&': theme => ({
          [theme.breakpoints.down('md')]: {
            margin: '5px',
          },
        }),
        ...fullWidthStyles,
        ...sx,
      }}
      action={
        onAction ? (
          <Button variant='outlined' size='small' onClick={() => onAction()}>
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
