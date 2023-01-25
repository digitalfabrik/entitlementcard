import { ProjectConfig } from '../getProjectConfig'
import { createEmptyBavariaCard } from '../../cards/cardBlueprints'
import { dataPrivacyBaseHeadline, DataPrivacyBaseText } from '../bayern/dataPrivacyBase'

const config: ProjectConfig = {
  name: 'Showcase Berechtigungskarte',
  projectId: 'showcase.entitlementcard.app',
  applicationFeatureEnabled: true,
  staticQrCodesEnabled: false,
  createEmptyCard: createEmptyBavariaCard,
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
  dataPrivacyContent: DataPrivacyBaseText,
}

export default config
