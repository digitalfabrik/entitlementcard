import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { styled } from '@mui/material'
import React, { CSSProperties, ReactElement } from 'react'

const severityColors = {
  info: '#000',
  error: '#ba1a1a',
}

const Container = styled('span')<{ $severity: 'info' | 'error'; $isToast: boolean }>`
  margin: 6px 0;
  color: ${props => (props.$isToast ? '#fff' : severityColors[props.$severity])};
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  white-space: pre-line;
`

type FormAlertProps = {
  errorMessage: string | null
  isToast?: boolean
  style?: CSSProperties
  severity?: 'info' | 'error'
}

const FormAlert = ({ errorMessage, isToast = false, severity = 'error', style }: FormAlertProps): ReactElement | null =>
  errorMessage ? (
    <Container style={style} $severity={severity} $isToast={isToast}>
      <InfoOutlined />
      {errorMessage}
    </Container>
  ) : null

export default FormAlert
