import { format } from 'date-fns'

import { BirthdayExtension } from '../../cards/extensions/BirthdayExtension'
import { NuernbergPassNumberExtension } from '../../cards/extensions/NuernbergPassNumberExtension'
import { RegionExtension } from '../../cards/extensions/RegionExtension'
import { daysSinceEpochToDate } from '../../cards/validityPeriod'
import { ProjectConfig } from '../getProjectConfig'
import { ActivityLogEntry } from './ActivityLogEntry'
import { DataPrivacyBaseText, dataPrivacyBaseHeadline } from './dataPrivacyBase'
// @ts-ignore
import pdfTemplate from './pdf-template.pdf'

const config: ProjectConfig = {
  name: 'Digitaler Nürnberg-Pass',
  projectId: 'nuernberg.sozialpass.app',
  applicationFeatureEnabled: false,
  staticQrCodesEnabled: true,
  card: {
    defaultValidity: { years: 1 },
    extensions: [BirthdayExtension, NuernbergPassNumberExtension, RegionExtension],
  },
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
  dataPrivacyContent: DataPrivacyBaseText,
  timezone: 'Europe/Berlin',
  activityLogConfig: {
    columnNames: ['Erstellt', 'Name', 'Passnummer', 'Geburtstag', 'Gültig bis'],
    renderLogEntry: ActivityLogEntry,
  },
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
