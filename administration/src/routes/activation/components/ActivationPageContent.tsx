import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import getCustomDeepLinkFromActivationCode from '../../../cards/getCustomDeepLinkFromActivationCode'
import ProjectSwitcher from '../../../components/ProjectSwitcher'
import { ProjectConfig } from '../../../project-configs/getProjectConfig'
import { getBuildConfig } from '../../../util/getBuildConfig'

const ActivationPageContent = ({
  config,
  activationCode,
}: {
  config: ProjectConfig
  activationCode: string
}): ReactElement => {
  const { t } = useTranslation('activation')
  if (!config.activation) {
    return <ProjectSwitcher />
  }
  const { activationText, downloadLink } = config.activation

  return (
    <>
      {activationText(
        config.name,
        downloadLink,
        getCustomDeepLinkFromActivationCode(
          activationCode,
          getBuildConfig(window.location.hostname),
        ),
        t,
      )}
    </>
  )
}

export default ActivationPageContent
