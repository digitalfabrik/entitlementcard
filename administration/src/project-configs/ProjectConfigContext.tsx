import { createContext, ReactNode } from 'react'
import getProjectConfig, { ProjectConfig } from './getProjectConfig'

const STAGING_PREFIX = 'staging.'
const projectConfig = getProjectConfig(window.location.hostname.replace(STAGING_PREFIX, ''))

export const ProjectConfigContext = createContext<ProjectConfig>(projectConfig)

export const ProjectConfigProvider = (props: { children: ReactNode }) => {
  const Provider = ProjectConfigContext.Provider
  return <Provider value={projectConfig}>{props.children}</Provider>
}
