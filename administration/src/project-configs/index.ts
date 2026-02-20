import { Color, PDFForm, PDFTextField } from '@cantoo/pdf-lib'
import { PaletteOptions } from '@mui/material'
import {
  BAYERN_PRODUCTION_ID,
  BAYERN_STAGING_ID,
  KOBLENZ_PRODUCTION_ID,
  KOBLENZ_STAGING_ID,
  NUERNBERG_PRODUCTION_ID,
  NUERNBERG_STAGING_ID,
} from 'build-configs'
import { Duration } from 'date-fns'
import { TFunction } from 'i18next'
import { ReactElement, ReactNode } from 'react'

import type { Card } from '../cards/card'
import type { CreateCardsResult } from '../cards/createCards'
import type { Extension } from '../cards/extensions/extensions'
import type { JsonField } from '../components/JsonFieldView'
import { CardInfo } from '../generated/card_pb'
import { type Region } from '../generated/graphql'
import type { ActivityLogEntryType } from '../routes/activity-log/utils/activityLog'
import { LOCAL_STORAGE_PROJECT_KEY } from '../util/getBuildConfig'
import { config as bayernConfig } from './bayern/config'
import { config as koblenzConfig } from './koblenz/config'
import { config as nuernbergConfig } from './nuernberg/config'
import { config as showcaseConfig } from './showcase/config'

export type ProjectConfig = {
  name: string
  colorPalette: PaletteOptions
  projectId: string
  publisherText: string
  applicationFeature?: {
    applicationJsonToPersonalData: (
      json: JsonField<'Array'>,
    ) => { forenames?: string; surname?: string } | null
    applicationJsonToCardQuery: (json: JsonField<'Array'>) => string | null
    applicationUsableWithApiToken: boolean
    csvExport: boolean
  }
  staticQrCodesEnabled: boolean
  card: CardConfig
  dataPrivacyHeadline: string
  dataPrivacyContent: () => ReactElement
  dataPrivacyAdditionalBaseContent?: () => ReactElement
  pdf: PdfConfig
  timezone: string
  activityLogConfig?: ActivityLogConfig
  activation?: {
    activationText: (
      applicationName: string,
      downloadLink: string,
      deepLink: string,
      t: TFunction,
    ) => ReactElement
    downloadLink: string
  }
  csvExport:
    | {
        enabled: true
        csvHeader: string[]
        buildCsvLine: (createCardsResult: CreateCardsResult, card: Card) => string
      }
    | {
        enabled: false
      }
  cardStatistics: CardStatistics
  freinetCSVImportEnabled: boolean
  freinetDataTransferEnabled: boolean
  cardCreation: boolean
  selfServiceEnabled: boolean
  storesManagement: StoresManagementConfig
  userImportApiEnabled: boolean
  showBirthdayExtensionHint: boolean
  locales: string[]
}

/**
 * For referencing embedded fonts, use a string, for downloading fonts use an URL.
 */
export type PdfFontReference = string | URL | undefined | null

export type PdfConfig = {
  title: string
  templatePath: string
  issuer: string
  customFont?: PdfFontReference
  customBoldFont?: PdfFontReference
  elements?: {
    staticVerificationQrCodes?: PdfQrCodeElementProps[]
    dynamicActivationQrCodes: PdfQrCodeElementProps[]
    text: PdfTextElementProps[]
    form?: PdfFormElementProps[]
    deepLinkArea?: PdfLinkAreaProps
  }
}

type Coordinates = {
  x: number
  y: number
}

export type PdfQrCodeElementProps = {
  size: number
} & Coordinates

export type PdfFormElementProps = {
  infoToFormFields: (form: PDFForm, pageIdx: number, info: InfoParams) => PDFTextField[]
  fontSize: number
  width: number
} & Coordinates

export type PdfLinkAreaProps = {
  size: number
} & Coordinates

export type PdfTextElementProps = {
  bold?: boolean
  maxWidth?: number | undefined
  fontSize: number
  textAlign?: 'left' | 'right' | 'center'
  spacing?: number
  angle?: number | undefined
  color?: Color
  infoToText: (info: InfoParams) => string
} & Coordinates

export type ActivityLogConfig = {
  columnNames: string[]
  renderLogEntry: (logEntry: ActivityLogEntryType) => ReactNode
}

export type InfoParams = {
  info: CardInfo
  card: Card
  cardInfoHash: string
  region?: Region
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CardConfig<T extends readonly Extension<any>[] = readonly Extension<any>[]> = {
  nameColumnName: string
  expiryColumnName: string
  extensionColumnNames: (string | null)[]
  defaultValidity: Duration
  extensions: T
}

export type StatisticsTheme = {
  colorCardCreated: string
  colorActivatedCard: string
  colorActivatedBlueCard: string
  colorActivatedGoldenCard: string
}

export type CardStatistics =
  | {
      enabled: true
      theme: StatisticsTheme
    }
  | {
      enabled: false
    }
export type StoresFieldConfig = {
  name: string
  isMandatory: boolean
  isValid: (value: string) => boolean
  columnWidth: number
}

export type StoresManagementConfig =
  | {
      enabled: true
      fields: StoresFieldConfig[]
    }
  | {
      enabled: false
    }

export const getProjectConfig = (hostname: string): ProjectConfig => {
  switch (window.localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY) ?? hostname) {
    case BAYERN_PRODUCTION_ID:
    case BAYERN_STAGING_ID:
      return bayernConfig
    case NUERNBERG_PRODUCTION_ID:
    case NUERNBERG_STAGING_ID:
      return nuernbergConfig
    case KOBLENZ_PRODUCTION_ID:
    case KOBLENZ_STAGING_ID:
      return koblenzConfig
    default:
      console.debug('Falling back to showcase.')
      return showcaseConfig
  }
}
