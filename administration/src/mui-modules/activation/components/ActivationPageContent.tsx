import React, { ReactElement } from 'react'

import ProjectSwitcher from '../../../bp-modules/util/ProjectSwitcher'
import { ProjectConfig } from '../../../project-configs/getProjectConfig'
import getCustomDeepLinkFromActivationCode from '../../../util/getCustomDeepLinkFromActivationCode'

const ActivationPageContent = ({
  config,
  activationCode,
}: {
  config: ProjectConfig
  activationCode: string
}): ReactElement => {
  if (!config.activation) {
    return <ProjectSwitcher />
  }
  const { activationText, downloadLink } = config.activation

  return <>{activationText(config.name, downloadLink, getCustomDeepLinkFromActivationCode(activationCode))}</>
}

export default ActivationPageContent
