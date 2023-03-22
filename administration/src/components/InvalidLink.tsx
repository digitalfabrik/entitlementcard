import { Alert, AlertTitle, styled } from '@mui/material'
import React, { ReactElement } from 'react'

const CenteredAlert = styled(Alert)`
  margin: auto;
`

const InvalidLink = (): ReactElement => (
  <CenteredAlert severity='info'>
    <AlertTitle>Ihr Link ist ungültig</AlertTitle>
    Ihr Link ist ungültig. Versuchen Sie, den Link manuell aus Ihrer E-Mail in die Addresszeile Ihres Browsers zu kopieren.
  </CenteredAlert>
)

export default InvalidLink
