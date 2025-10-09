import BavariaCardTypeExtension from '../../cards/extensions/BavariaCardTypeExtension'
import RegionExtension from '../../cards/extensions/RegionExtension'
import { applicationJsonToCardQuery, applicationJsonToPersonalData } from '../bayern/config'
import { DataPrivacyBaseText, dataPrivacyBaseHeadline } from '../bayern/dataPrivacyBase'
import pdfConfiguration from '../bayern/pdf'
import { commonColors } from '../common/colors'
import type { ProjectConfig } from '../getProjectConfig'

const config: ProjectConfig = {
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
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
  dataPrivacyContent: DataPrivacyBaseText,
  timezone: 'Europe/Berlin',
  pdf: pdfConfiguration,
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
}

export default config
