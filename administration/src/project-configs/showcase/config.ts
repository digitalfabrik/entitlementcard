import { BavariaCardTypeExtension } from '../../cards/extensions/BavariaCardTypeExtension'
import { RegionExtension } from '../../cards/extensions/RegionExtension'
import bayern from '../bayern/config'
import { DataPrivacyBaseText, dataPrivacyBaseHeadline } from '../bayern/dataPrivacyBase'
import { ProjectConfig } from '../getProjectConfig'

const config: ProjectConfig = {
  name: 'Showcase Berechtigungskarte',
  projectId: 'showcase.entitlementcard.app',
  applicationFeatureEnabled: true,
  staticQrCodesEnabled: false,
  card: {
    defaultValidity: { years: 3 },
    extensions: [BavariaCardTypeExtension, RegionExtension],
  },
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
  dataPrivacyContent: DataPrivacyBaseText,
  timezone: 'Europe/Berlin',
  pdf: {
    title: 'Karten',
    templatePath: null,
    issuer: 'Tür an Tür Digitalfabrik gGmbH',
    infoToDetails: bayern.pdf.infoToDetails,
  },
}

export default config
