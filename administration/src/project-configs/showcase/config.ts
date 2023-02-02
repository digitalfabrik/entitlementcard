import { ProjectConfig } from '../getProjectConfig'
import { createEmptyBavariaCard } from '../../cards/cardBlueprints'
import { dataPrivacyBaseHeadline, DataPrivacyBaseText } from '../bayern/dataPrivacyBase'
import bayern from '../bayern/config'

const config: ProjectConfig = {
  name: 'Showcase Berechtigungskarte',
  projectId: 'showcase.entitlementcard.app',
  applicationFeatureEnabled: true,
  staticQrCodesEnabled: false,
  createEmptyCard: createEmptyBavariaCard,
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
  dataPrivacyContent: DataPrivacyBaseText,
  pdf: {
    title: 'Karten',
    templatePath: null,
    issuer: 'Tür an Tür Digitalfabrik gGmbH',
    infoToDetails: bayern.pdf.infoToDetails,
  },
}

export default config
