import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { Typography, styled } from '@mui/material'
import { Theme } from '@mui/system'
import React, { ReactElement } from 'react'

const severityColors = (theme: Theme) => ({
  info: theme.palette.common.black,
  error: theme.palette.error.main,
})

const Container = styled('span', {
  shouldForwardProp: prop => !['$severity', '$isToast'].includes(prop as string),
})<{ $severity: 'info' | 'error'; $isToast: boolean }>(({ theme, $severity, $isToast }) => ({
  margin: theme.spacing(0.5, 0), // Using MUI's spacing utility
  color: $isToast ? theme.palette.common.white : severityColors(theme)[$severity],
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
  whiteSpace: 'pre-line',
}))

type FormAlertProps = {
  errorMessage: string | ReactElement | null | undefined
  isToast?: boolean
  severity?: 'info' | 'error'
}

const FormAlert = ({ errorMessage, isToast = false, severity = 'error' }: FormAlertProps): ReactElement | null =>
  errorMessage !== null ? (
    <Container $severity={severity} $isToast={isToast} data-testid='form-alert'>
      <InfoOutlined />
      <Typography component='span'>{errorMessage}</Typography>
    </Container>
  ) : null

export default FormAlert
