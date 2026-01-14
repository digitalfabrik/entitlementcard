import React, { ReactElement, ReactNode, createContext } from 'react'

import type { ProjectConfig } from './getProjectConfig'
import showcaseConfig from './showcase/config'

export const ProjectConfigContext = createContext<ProjectConfig>(showcaseConfig)

type ProjectConfigProviderProps = {
  children: ReactNode
  projectConfig: ProjectConfig
}

export const ProjectConfigProvider = ({
  children,
  projectConfig,
}: ProjectConfigProviderProps): ReactElement => {
  const Provider = ProjectConfigContext.Provider
  return <Provider value={projectConfig}>{children}</Provider>
}
