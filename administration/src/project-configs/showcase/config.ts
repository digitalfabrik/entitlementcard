import { createEmptyBavariaCard } from '../../cards/cardBlueprints'
import bayern from '../bayern/config'
import { DataPrivacyBaseText, dataPrivacyBaseHeadline } from '../bayern/dataPrivacyBase'
import { ProjectConfig } from '../getProjectConfig'

const config: ProjectConfig = {
  name: 'Showcase Berechtigungskarte',
  projectId: 'showcase.entitlementcard.app',
  applicationFeatureEnabled: true,
  staticQrCodesEnabled: false,
  createEmptyCard: createEmptyBavariaCard,
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
