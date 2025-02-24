import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { Alert, styled } from '@mui/material'
import React, { CSSProperties, ReactElement } from 'react'

const Container = styled(Alert)`
  margin: 6px 0;
`

type FormAlertProps = {
  errorMessage: string | null
  style?: CSSProperties
  severity?: 'success' | 'info' | 'warning' | 'error'
}

const FormAlert = ({ errorMessage, severity = 'error', style }: FormAlertProps): ReactElement | null =>
  errorMessage ? (
    <Container style={style} icon={<InfoOutlined />} severity={severity}>
      {errorMessage}
    </Container>
  ) : null

export default FormAlert
