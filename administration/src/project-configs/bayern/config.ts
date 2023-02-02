import { ProjectConfig } from '../getProjectConfig'
import { dataPrivacyBaseHeadline, DataPrivacyBaseText } from './dataPrivacyBase'
import { createEmptyBavariaCard } from '../../cards/cardBlueprints'
// @ts-ignore
import pdfTemplate from './pdf-template.pdf'

const config: ProjectConfig = {
  name: 'Ehrenamtskarte Bayern',
  projectId: 'bayern.ehrenamtskarte.app',
  applicationFeatureEnabled: true,
  staticQrCodesEnabled: false,
  createEmptyCard: createEmptyBavariaCard,
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
  dataPrivacyContent: DataPrivacyBaseText,
  pdf: {
    templatePath: pdfTemplate,
    issuer: 'Bayerische Staatsministerium für Arbeit und Soziales, Familie und Integration',
  },
}

export default config
