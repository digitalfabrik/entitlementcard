import { Alert, AlertTitle, styled } from '@mui/material'
import React, { ReactElement } from 'react'

const CenteredAlert = styled(Alert)`
  margin: auto;
`

const InvalidLink = (): ReactElement => {
  return (
    <CenteredAlert severity='info'>
      <AlertTitle>Ihr Link ist ungültig</AlertTitle>
      Ihr Link konnte nicht korrekt aufgelöst werden. Bitte kopieren Sie den Link manuell aus Ihrer E-Mail.
    </CenteredAlert>
  )
}

export default InvalidLink
