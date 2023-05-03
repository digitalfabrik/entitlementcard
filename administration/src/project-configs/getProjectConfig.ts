import { ReactElement, ReactNode } from 'react'

import { ActivityLog } from '../bp-modules/user-settings/ActivityLog'
import { ExtensionClass } from '../cards/extensions/extensions'
import { CardInfo } from '../generated/card_pb'
import { Region } from '../generated/graphql'
import bayernConfig from './bayern/config'
import nuernbergConfig from './nuernberg/config'
import showcaseConfig from './showcase/config'

export interface PdfConfig {
  title: string
  templatePath: string | null
  issuer: string
  infoToDetails: (info: CardInfo, region: Region, shorten: boolean) => string
}

export interface ActivityLogConfig {
  columnNames: string[]
  renderLogEntry: (logEntry: ActivityLog) => ReactNode
}

export interface CardConfig {
  defaultValidity: Duration
  extensions: ExtensionClass[]
}

export interface ProjectConfig {
  name: string
  projectId: string
  applicationFeatureEnabled: boolean
  staticQrCodesEnabled: boolean
  card: CardConfig
  dataPrivacyHeadline: string
  dataPrivacyContent: () => ReactElement
  pdf: PdfConfig
  timezone: string
  activityLogConfig?: ActivityLogConfig
}

export const setProjectConfigOverride = (hostname: string) => {
  window.localStorage.setItem('project-override', hostname)
}

const getProjectConfig = (hostname: string): ProjectConfig => {
  switch (window.localStorage.getItem('project-override') ?? hostname) {
    case 'bayern.ehrenamtskarte.app':
    case 'staging.bayern.ehrenamtskarte.app':
      return bayernConfig
    case 'nuernberg.sozialpass.app':
    case 'staging.nuernberg.sozialpass.app':
      return nuernbergConfig
    default:
      console.debug('Falling back to showcase.')
      return showcaseConfig
  }
}

export default getProjectConfig
