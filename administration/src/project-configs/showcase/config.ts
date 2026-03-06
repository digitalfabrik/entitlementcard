import BavariaCardTypeExtension from '../../cards/extensions/BavariaCardTypeExtension'
import RegionExtension from '../../cards/extensions/RegionExtension'
import { config as bayernConfig } from '../bayern/config'
import { DataPrivacyBaseText } from '../bayern/dataPrivacy'
import {
  applicationJsonToCardQuery,
  applicationJsonToPersonalData,
} from '../common/applicationFeatures'
import { commonColors } from '../common/colors'
import type { ProjectConfig } from '../index'

export const config: ProjectConfig = {
  colorPalette: commonColors,
  name: 'Showcase Berechtigungskarte',
  projectId: 'showcase.entitlementcard.app',
  publisherText: 'Showcase gGmbH',
  applicationFeature: {
    applicationJsonToPersonalData,
    applicationJsonToCardQuery,
    applicationUsableWithApiToken: true,
    csvExport: true,
  },
  staticQrCodesEnabled: false,
  card: {
    nameColumnName: 'Name',
    expiryColumnName: 'Ablaufdatum',
    extensionColumnNames: ['Kartentyp', null],
    defaultValidity: { years: 3 },
    extensions: [BavariaCardTypeExtension, RegionExtension],
  },
  dataPrivacyHeadline:
    'Datenschutzerklärung für die Nutzung und Beantragung der digitalen Berechtigungskarte',
  dataPrivacyContent: DataPrivacyBaseText,
  timezone: 'Europe/Berlin',
  pdf: bayernConfig.pdf,
  csvExport: {
    enabled: false,
  },
  cardStatistics: { enabled: false },
  freinetCSVImportEnabled: true,
  freinetDataTransferEnabled: false,
  cardCreation: true,
  selfServiceEnabled: false,
  storesManagement: {
    enabled: false,
  },
  userImportApiEnabled: false,
  showBirthdayExtensionHint: false,
  locales: ['de'],
}
