import { ProjectConfig } from '../getProjectConfig'
import { dataPrivacyBaseHeadline, DataPrivacyBaseText } from './dataPrivacyBase'

const config: ProjectConfig = {
  name: 'Ehrenamtskarte Bayern',
  projectId: 'bayern.ehrenamtskarte.app',
  applicationFeatureEnabled: true,
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
  dataPrivacyContent: DataPrivacyBaseText,
}

export default config
