import { Button } from '@mui/material'
import { styled } from '@mui/system'
import React, { ReactElement } from 'react'
import { useLocation } from 'react-router-dom'

import ProjectSwitcher from '../../../bp-modules/util/ProjectSwitcher'
import InvalidActivationLink from '../../../errors/templates/InvalidActivationLink'
import { ProjectConfig } from '../../../project-configs/getProjectConfig'

const ActivationButton = styled(Button)`
  margin-top: 20px;
`

const ActivationPageContent = ({ config }: { config: ProjectConfig }): ReactElement => {
  const { hash } = useLocation()

  if (!config.activation) {
    return <ProjectSwitcher />
  }

  const { activationText, downloadLink } = config.activation

  if (!hash) {
    return <InvalidActivationLink />
  }

  return (
    <>
      {activationText(config.name, downloadLink)}
      <ActivationButton variant='outlined' color='primary' href={window.location.href}>
        Aktiviere Karte
      </ActivationButton>
    </>
  )
}

export default ActivationPageContent
