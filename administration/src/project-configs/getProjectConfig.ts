import { ReactElement } from 'react'
import bayernConfig from './bayern/config'
import nuernbergConfig from './nuernberg/config'
import showcaseConfig from './showcase/config'
import { CardBlueprint } from '../cards/CardBlueprint'
import { Region } from '../generated/graphql'

export interface PdfConfig {
  title: string
  templatePath: string | null
  issuer: string
}

export interface ProjectConfig {
  name: string
  projectId: string
  applicationFeatureEnabled: boolean
  staticQrCodesEnabled: boolean
  createEmptyCard: (region: Region) => CardBlueprint
  dataPrivacyHeadline: string
  dataPrivacyContent: () => ReactElement
  pdf: PdfConfig
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
