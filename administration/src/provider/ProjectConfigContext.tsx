import React, { ReactElement, ReactNode, createContext } from 'react'

import type { ProjectConfig } from '../project-configs'
import { config as showcaseConfig } from '../project-configs/showcase/config'

export const ProjectConfigContext = createContext<ProjectConfig>(showcaseConfig)

export const ProjectConfigProvider = ({
  children,
  projectConfig,
}: {
  children: ReactNode
  projectConfig: ProjectConfig
}): ReactElement => (
  <ProjectConfigContext.Provider value={projectConfig}>{children}</ProjectConfigContext.Provider>
)
