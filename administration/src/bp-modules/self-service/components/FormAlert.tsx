import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { styled } from '@mui/material'
import React, { CSSProperties, ReactElement } from 'react'

const Container = styled('div')<{ $severity: 'info' | 'error' }>`
  margin: 6px 0;
  color: ${props => (props.$severity === 'info' ? '#000' : '#ba1a1a')};
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
`

type FormAlertProps = {
  errorMessage: string | null
  style?: CSSProperties
  severity?: 'info' | 'error'
}

const FormAlert = ({ errorMessage, severity = 'error', style }: FormAlertProps): ReactElement | null =>
  errorMessage ? (
    <Container style={style} $severity={severity}>
      <InfoOutlined />
      {errorMessage}
    </Container>
  ) : null

export default FormAlert
