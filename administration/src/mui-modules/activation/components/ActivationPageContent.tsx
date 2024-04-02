import React, { ReactElement } from 'react'

import ProjectSwitcher from '../../../bp-modules/util/ProjectSwitcher'
import { ProjectConfig } from '../../../project-configs/getProjectConfig'

const ActivationPageContent = ({ config }: { config: ProjectConfig }): ReactElement => {
  if (!config.activation) {
    return <ProjectSwitcher />
  }
  const { activationText, downloadLink } = config.activation

  return <>{activationText(config.name, downloadLink)}</>
}

export default ActivationPageContent
