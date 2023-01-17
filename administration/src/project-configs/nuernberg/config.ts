import { ProjectConfig } from '../getProjectConfig'
import { createEmptyNuernbergCard } from '../../cards/cardBlueprints'
import { dataPrivacyBaseHeadline, DataPrivacyBaseText } from './dataPrivacyBase'
import pdfLogo from './pdf-logo.png'

const config: ProjectConfig = {
  name: 'Digitaler Nürnberg-Pass',
  projectId: 'nuernberg.sozialpass.app',
  applicationFeatureEnabled: false,
  createEmptyCard: createEmptyNuernbergCard,
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
  dataPrivacyContent: DataPrivacyBaseText,
  pdf: {
    logo: pdfLogo,
    issuer: 'Stadt Nürnberg',
    appName: 'Sozialpass',
    appDownloadLink: 'https://download.nuernberg.sozialpass.app/',
    greeting: (fullName: string) => [`Guten Tag, ${fullName}`, 'Ihr digitaler Nürnberg-Pass ist da!'],
    disclaimer: [
      'Bitte beachten Sie, dass der Nürnberg-Pass nur in Verbindung mit einem amtlichen und gültigen Lichtbildausweis gültig ist.',
    ],
  },
}

export default config
