import { ProjectConfig } from '../getProjectConfig'
import { createEmptyBavariaCard } from '../../cards/cardBlueprints'
import { dataPrivacyBaseHeadline, DataPrivacyBaseText } from '../bayern/dataPrivacyBase'

const config: ProjectConfig = {
  name: 'Showcase Berechtigungskarte',
  projectId: 'showcase.entitlementcard.app',
  applicationFeatureEnabled: true,
  createEmptyCard: createEmptyBavariaCard,
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
  dataPrivacyContent: DataPrivacyBaseText,
  pdf: {
    logo: null,
    issuer: 'Tür an Tür Digitalfabrik gGmbH',
    appName: 'Ehrenamtskarte Bayern',
    appDownloadLink: 'https://download.bayern.ehrenamtskarte.app/',
    greeting: (fullName: string) => [`Guten Tag, ${fullName}`, 'Ihr "Irgendwas" ist da!'],
    disclaimer: [
      'Bitte beachten Sie, dass ihr "Irgendwas" nur in Verbindung mit einem amtlichen und gültigen Lichtbildausweis gültig ist.',
    ],
  },
}

export default config
