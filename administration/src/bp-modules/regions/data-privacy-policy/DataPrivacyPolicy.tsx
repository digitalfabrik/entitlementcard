import { Typography } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import styled from 'styled-components'

import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'

const Container = styled.div`
  max-width: 750px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-self: center;
`

const DataPrivacyPolicy = (): ReactElement => {
  const config = useContext(ProjectConfigContext)
  return (
    <Container>
      <Typography variant='h4'>{config.dataPrivacyHeadline}</Typography>
      <config.dataPrivacyContent />
      {config.dataPrivacyAdditionalBaseContent && <config.dataPrivacyAdditionalBaseContent />}
    </Container>
  )
}

export default DataPrivacyPolicy
