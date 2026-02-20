import { buildConfigBayern } from 'build-configs'

import BavariaCardTypeExtension from '../../cards/extensions/BavariaCardTypeExtension'
import EMailNotificationExtension from '../../cards/extensions/EMailNotificationExtension'
import RegionExtension from '../../cards/extensions/RegionExtension'
import { ActivationText } from '../common/ActivationText'
import {
  applicationJsonToCardQuery,
  applicationJsonToPersonalData,
} from '../common/applicationFeatures'
import { commonColors } from '../common/colors'
import type { ProjectConfig } from '../index'
import { DataPrivacyAdditionalBaseText, DataPrivacyBaseText } from './dataPrivacy'
import { renderCardHash, renderPdfInfo } from './pdf'
import pdfTemplate from './pdf-template.pdf'

export const config: ProjectConfig = {
  colorPalette: commonColors,
  name: 'Ehrenamtskarte Bayern',
  projectId: 'bayern.ehrenamtskarte.app',
  publisherText: buildConfigBayern.common.publisherText,
  applicationFeature: {
    applicationJsonToPersonalData,
    applicationJsonToCardQuery,
    applicationUsableWithApiToken: true,
    csvExport: true,
  },
  staticQrCodesEnabled: false,
  card: {
    defaultValidity: { years: 3 },
    nameColumnName: 'Name',
    expiryColumnName: 'Ablaufdatum',
    extensionColumnNames: ['Kartentyp', null, 'MailNotification'],
    extensions: [BavariaCardTypeExtension, RegionExtension, EMailNotificationExtension],
  },
  dataPrivacyHeadline:
    'Datenschutzerklärung für die Nutzung und Beantragung der digitalen bayerischen Ehrenamtskarte',
  dataPrivacyContent: DataPrivacyBaseText,
  dataPrivacyAdditionalBaseContent: DataPrivacyAdditionalBaseText,
  activation: {
    activationText: ActivationText,
    downloadLink: 'https://download.bayern.ehrenamtskarte.app/',
  },
  timezone: 'Europe/Berlin',
  pdf: {
    title: 'Ehrenamtskarten',
    templatePath: pdfTemplate,
    issuer: 'Bayerische Staatsministerium für Arbeit und Soziales, Familie und Integration',
    customFont: 'Inter-Regular',
    elements: {
      dynamicActivationQrCodes: [{ x: 140, y: 73, size: 51 }],
      text: [
        { x: 142, y: 137, maxWidth: 84, fontSize: 10, spacing: 4, infoToText: renderPdfInfo },
        { x: 165, y: 129, fontSize: 6, textAlign: 'center', infoToText: renderCardHash },
      ],
      deepLinkArea: { x: 140, y: 73, size: 51 },
    },
  },
  csvExport: {
    enabled: false,
  },
  cardStatistics: {
    enabled: true,
    theme: {
      colorCardCreated: '#D9D9D9',
      colorActivatedCard: '#C6C0D8',
      colorActivatedBlueCard: '#3B82F6',
      colorActivatedGoldenCard: '#EFBF04',
    },
  },
  freinetCSVImportEnabled: true,
  freinetDataTransferEnabled: false,
  cardCreation: true,
  selfServiceEnabled: false,
  storesManagement: {
    enabled: false,
  },
  userImportApiEnabled: false,
  showBirthdayExtensionHint: false,
  locales: buildConfigBayern.common.appLocales,
}
