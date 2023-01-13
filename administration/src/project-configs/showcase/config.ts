import { ProjectConfig } from '../getProjectConfig'
import { dataPrivacyBaseHeadline, DataPrivacyBaseText } from '../bayern/dataPrivacyBase'

const config: ProjectConfig = {
  name: 'Showcase Berechtigungskarte',
  projectId: 'showcase.entitlementcard.app',
  applicationFeatureEnabled: true,
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
  dataPrivacyText: DataPrivacyBaseText,
}

export default config
