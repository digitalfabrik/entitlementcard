import { format } from 'date-fns'

import { BavariaCardTypeExtension } from '../../cards/extensions/BavariaCardTypeExtension'
import { RegionExtension } from '../../cards/extensions/RegionExtension'
import { daysSinceEpochToDate } from '../../cards/validityPeriod'
import { BavariaCardType } from '../../generated/card_pb'
import { ProjectConfig } from '../getProjectConfig'
import { DataPrivacyBaseText, dataPrivacyBaseHeadline } from './dataPrivacyBase'
// @ts-ignore
import pdfTemplate from './pdf-template.pdf'

const config: ProjectConfig = {
  name: 'Ehrenamtskarte Bayern',
  projectId: 'bayern.ehrenamtskarte.app',
  applicationFeatureEnabled: true,
  staticQrCodesEnabled: false,
  card: {
    defaultValidity: { years: 3 },
    extensions: [BavariaCardTypeExtension, RegionExtension],
  },
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
  dataPrivacyContent: DataPrivacyBaseText,
  timezone: 'Europe/Berlin',
  pdf: {
    title: 'Ehrenamtskarten',
    templatePath: pdfTemplate,
    issuer: 'Bayerische Staatsministerium für Arbeit und Soziales, Familie und Integration',
    infoToDetails: (info, region, shorten) => {
      const expirationDay = info.expirationDay ?? 0
      const expirationDate =
        expirationDay > 0 ? format(daysSinceEpochToDate(expirationDay), 'dd.MM.yyyy') : 'unbegrenzt'

      const cardType = info.extensions?.extensionBavariaCardType?.cardType
      return `${info.fullName}
Kartentyp: ${cardType === BavariaCardType.STANDARD ? 'Blau' : 'Gold'}
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
