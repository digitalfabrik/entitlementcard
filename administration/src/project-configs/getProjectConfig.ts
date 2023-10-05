import { ReactElement, ReactNode } from 'react'

import { JsonField } from '../bp-modules/applications/JsonFieldView'
import { ActivityLog } from '../bp-modules/user-settings/ActivityLog'
import { ExtensionClass } from '../cards/extensions/extensions'
import { PdfFormElementProps } from '../cards/pdf/PdfFormElement'
import { PdfQrCodeElementProps } from '../cards/pdf/PdfQrCodeElement'
import { PdfTextElementProps } from '../cards/pdf/PdfTextElement'
import bayernConfig from './bayern/config'
import nuernbergConfig from './nuernberg/config'
import showcaseConfig from './showcase/config'

export interface PdfConfig {
  title: string
  templatePath: string | null
  issuer: string
  elements?: {
    staticVerificationQrCodes?: PdfQrCodeElementProps[]
    dynamicActivationQrCodes: PdfQrCodeElementProps[]
    text: PdfTextElementProps[]
    form?: PdfFormElementProps[]
  }
}

export interface ActivityLogConfig {
  columnNames: string[]
  renderLogEntry: (logEntry: ActivityLog) => ReactNode
}

export interface CardConfig {
  nameColumnName: string
  expiryColumnName: string
  extensionColumnNames: (string | null)[]
  defaultValidity: Duration
  extensions: ExtensionClass[]
}

export interface ApplicationFeature {
  applicationJsonToPersonalData: (json: JsonField<'Array'>) => { forenames?: string; surname?: string } | null
  applicationJsonToCardQuery: (json: JsonField<'Array'>) => string | null
}

export interface ProjectConfig {
  name: string
  projectId: string
  applicationFeature?: ApplicationFeature
  staticQrCodesEnabled: boolean
  card: CardConfig
  dataPrivacyHeadline: string
  dataPrivacyContent: () => ReactElement
  dataPrivacyAdditionalBaseContent?: () => ReactElement
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
