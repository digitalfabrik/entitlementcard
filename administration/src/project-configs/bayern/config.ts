import { ProjectConfig } from '../getProjectConfig'
import { dataPrivacyBaseHeadline, DataPrivacyBaseText } from './dataPrivacyBase'
import { createEmptyBavariaCard } from '../../cards/cardBlueprints'
// @ts-ignore
import pdfTemplate from './pdf-template.pdf'
import { daysSinceEpochToDate } from '../../cards/validityPeriod'
import { format } from 'date-fns'
import { BavariaCardType } from '../../generated/card_pb'

const config: ProjectConfig = {
  name: 'Ehrenamtskarte Bayern',
  projectId: 'bayern.ehrenamtskarte.app',
  applicationFeatureEnabled: true,
  staticQrCodesEnabled: false,
  createEmptyCard: createEmptyBavariaCard,
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
  dataPrivacyContent: DataPrivacyBaseText,
  pdf: {
    title: 'Ehrenamtskarte',
    templatePath: pdfTemplate,
    issuer: 'Bayerische Staatsministerium für Arbeit und Soziales, Familie und Integration',
    infoToDetails: (info, region, shorten) => {
      const expirationDay = info.expirationDay ?? 0
      const expirationDate =
        expirationDay > 0 ? format(daysSinceEpochToDate(expirationDay), 'dd.MM.yyyy') : 'unbegrenzt'

      const cardType = info.extensions?.extensionBavariaCardType?.cardType
      return `${info.fullName}
Kartentyp: ${cardType == BavariaCardType.STANDARD ? 'Blau' : 'Gold'}
Gültig bis: ${expirationDate}
${
  shorten
    ? `Aussteller: ${region.prefix} ${region.name}`
    : `Ausgestellt am ${format(new Date(), 'dd.MM.yyyy')} von ${region.prefix} ${region.name}`
}`
    },
  },
}

export default config
