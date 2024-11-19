import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { styled } from '@mui/material'
import React, { CSSProperties, ReactElement } from 'react'

const Container = styled('div')`
  margin: 6px 0;
  color: #ba1a1a;
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
`

type FormErrorMessageProps = {
  errorMessage: string | null
  style?: CSSProperties
}

const FormErrorMessage = ({ errorMessage, style }: FormErrorMessageProps): ReactElement | null =>
  errorMessage ? (
    <Container style={style}>
      <InfoOutlined />
      {errorMessage}
    </Container>
  ) : null

export default FormErrorMessage
