import { format } from 'date-fns'

import { createEmptyNuernbergCard } from '../../cards/cardBlueprints'
import { daysSinceEpochToDate } from '../../cards/validityPeriod'
import { ProjectConfig } from '../getProjectConfig'
import { DataPrivacyBaseText, dataPrivacyBaseHeadline } from './dataPrivacyBase'
// @ts-ignore
import pdfTemplate from './pdf-template.pdf'

const config: ProjectConfig = {
  name: 'Digitaler Nürnberg-Pass',
  projectId: 'nuernberg.sozialpass.app',
  applicationFeatureEnabled: false,
  staticQrCodesEnabled: true,
  createEmptyCard: createEmptyNuernbergCard,
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
  dataPrivacyContent: DataPrivacyBaseText,
  timezone: 'Europe/Berlin',
  pdf: {
    title: 'Nürnberg-Pässe',
    templatePath: pdfTemplate,
    issuer: 'Stadt Nürnberg',
    infoToDetails: (info, _region, shorten) => {
      const expirationDay = info.expirationDay
      if (!expirationDay) {
        throw new Error('expirationDay must be defined for Nürnberg')
      }

      const expirationDate = format(daysSinceEpochToDate(expirationDay), 'dd.MM.yyyy')
      return `${info.fullName}
Passnummer: ${info.extensions?.extensionNuernbergPassNumber?.passNumber}
Geburtsdatum: ${format(daysSinceEpochToDate(info.extensions?.extensionBirthday?.birthday ?? 0), 'dd.MM.yyyy')}
Gültig bis: ${expirationDate}
${shorten ? '' : `Ausgestellt am: ${format(new Date(), 'dd.MM.yyyy')}`}`
    },
  },
}

export default config
