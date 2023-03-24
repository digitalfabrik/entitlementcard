import { Alert, AlertTitle, styled } from '@mui/material'
import React, { ReactElement, ReactNode } from 'react'

const CenteredAlert = styled(Alert)`
  margin: auto;
`
type InvalidLinkType = {
  title: string
  description?: string | ReactNode
}

const InvalidLink = ({ title, description }: InvalidLinkType): ReactElement => (
  <CenteredAlert severity='info'>
    <AlertTitle>{title}</AlertTitle>
    {description}
  </CenteredAlert>
)

export default InvalidLink
