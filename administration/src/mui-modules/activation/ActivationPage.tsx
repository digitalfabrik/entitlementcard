import { Card } from '@mui/material'
import { styled } from '@mui/system'
import React, { ReactElement, useContext } from 'react'

import StandaloneCenter from '../../bp-modules/StandaloneCenter'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import ActivationPageContent from './components/ActivationPageContent'

const CardContainer = styled(Card)`
  margin: 20px;
  padding: 20px;
  max-width: 500px;
`

const StandaloneHorizontalCenter = styled(StandaloneCenter)`
  justify-content: start;
  margin-top: 10%;
`

const ActivationPage = (): ReactElement | null => {
  const config = useContext(ProjectConfigContext)

  return (
    <StandaloneHorizontalCenter>
      <CardContainer>
        <ActivationPageContent config={config} />
      </CardContainer>
    </StandaloneHorizontalCenter>
  )
}

export default ActivationPage
