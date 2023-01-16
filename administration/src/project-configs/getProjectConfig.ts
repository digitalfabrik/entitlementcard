import { ReactElement } from 'react'
import bayernConfig from './bayern/config'
import nuernbergConfig from './nuernberg/config'
import showcaseConfig from './showcase/config'

export interface ProjectConfig {
  name: string
  projectId: string
  applicationFeatureEnabled: boolean
  dataPrivacyHeadline: string
  dataPrivacyContent: () => ReactElement
}

const getProjectConfig = (hostname: string): ProjectConfig => {
  switch (window.localStorage.getItem('project-override') ?? hostname) {
    case 'bayern.ehrenamtskarte.app':
      return bayernConfig
    case 'nuernberg.sozialpass.app':
      return nuernbergConfig
    default:
      console.debug('Falling back to showcase.')
      return showcaseConfig
  }
}

export default getProjectConfig
