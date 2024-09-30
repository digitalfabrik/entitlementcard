import { ReactElement, ReactNode, createContext } from 'react'

import getProjectConfig, { ProjectConfig } from './getProjectConfig'

const projectConfig = getProjectConfig(window.location.hostname)

export const ProjectConfigContext = createContext<ProjectConfig>(projectConfig)

export const ProjectConfigProvider = (props: { children: ReactNode }): ReactElement => {
  const Provider = ProjectConfigContext.Provider
  return <Provider value={projectConfig}>{props.children}</Provider>
}
