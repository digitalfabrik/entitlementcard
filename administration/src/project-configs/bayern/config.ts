import { ProjectConfig } from '../getProjectConfig'
import { dataPrivacyBaseHeadline, DataPrivacyBaseText } from './dataPrivacyBase'
import { createEmptyBavariaCard } from '../../cards/cardBlueprints'
import pdfLogo from './pdf-logo.png'

const config: ProjectConfig = {
  name: 'Ehrenamtskarte Bayern',
  projectId: 'bayern.ehrenamtskarte.app',
  applicationFeatureEnabled: true,
  createEmptyCard: createEmptyBavariaCard,
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
  dataPrivacyContent: DataPrivacyBaseText,
  pdf: {
    logo: pdfLogo,
    issuer: 'Bayerische Staatsministerium für Arbeit und Soziales, Familie und Integration',
    appName: 'Ehrenamtskarte Bayern',
    appDownloadLink: 'https://download.bayern.ehrenamtskarte.app/',
    greeting: (fullName: string) => [`Guten Tag, ${fullName}`, 'Ihre digitale Eherenamtskarte ist da!'],
    disclaimer: [
      'Bitte beachten Sie, dass die Ehrenamtskarte nur in Verbindung mit einem amtlichen und gültigen Lichtbildausweis gültig ist.',
    ],
  },
}

export default config
