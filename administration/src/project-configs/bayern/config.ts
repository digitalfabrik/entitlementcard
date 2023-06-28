import BavariaCardTypeExtension from '../../cards/extensions/BavariaCardTypeExtension'
import RegionExtension from '../../cards/extensions/RegionExtension'
import { ProjectConfig } from '../getProjectConfig'
import { DataPrivacyAdditionalBaseText, DataPrivacyBaseText, dataPrivacyBaseHeadline } from './dataPrivacyBase'
import pdfConfiguration from './pdf'

const config: ProjectConfig = {
  name: 'Ehrenamtskarte Bayern',
  projectId: 'bayern.ehrenamtskarte.app',
  applicationFeatureEnabled: true,
  staticQrCodesEnabled: false,
  card: {
    defaultValidity: { years: 3 },
    nameColumnName: 'Name',
    expiryColumnName: 'Ablaufdatum',
    extensionColumnNames: ['Kartentyp', null],
    extensions: [BavariaCardTypeExtension, RegionExtension],
  },
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
  dataPrivacyContent: DataPrivacyBaseText,
  dataPrivacyAdditionalBaseContent: DataPrivacyAdditionalBaseText,
  timezone: 'Europe/Berlin',
  pdf: pdfConfiguration,
}

export default config
