import { ProjectConfig } from '../getProjectConfig'
import { createEmptyNuernbergCard } from '../../cards/cardBlueprints'
import { dataPrivacyBaseHeadline, DataPrivacyBaseText } from './dataPrivacyBase'
// @ts-ignore
import pdfTemplate from './pdf-template.pdf'

const config: ProjectConfig = {
  name: 'Digitaler Nürnberg-Pass',
  projectId: 'nuernberg.sozialpass.app',
  applicationFeatureEnabled: false,
  createEmptyCard: createEmptyNuernbergCard,
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
  dataPrivacyContent: DataPrivacyBaseText,
  pdf: {
    templatePath: pdfTemplate,
    issuer: 'Stadt Nürnberg',
  },
}

export default config
