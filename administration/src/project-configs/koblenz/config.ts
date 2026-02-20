import {
  QUERY_PARAM_BIRTHDAY,
  QUERY_PARAM_KOBLENZ_REFERENCE_NUMBER,
  QUERY_PARAM_NAME,
  buildConfigKoblenz,
} from 'build-configs'

import BirthdayExtension from '../../cards/extensions/BirthdayExtension'
import KoblenzReferenceNumberExtension from '../../cards/extensions/KoblenzReferenceNumberExtension'
import { ActivationText } from '../common/ActivationText'
import { commonColors } from '../common/colors'
import { ProjectConfig } from '../index'
import { storesManagementConfig } from '../storesManagementConfig'
import { DataPrivacyBaseText } from './dataPrivacy'
import { renderPdfDetails } from './pdf'
import pdfTemplate from './pdf-template.pdf'

export const config: ProjectConfig = {
  colorPalette: {
    ...commonColors,
    primary: { main: '#3b83f6', light: '#bdddff' },
    secondary: { main: '#922224', light: '#f1c9cf' },
    accent: { main: '#E2007A', light: '#fce5f0' },
  },
  name: 'KoblenzPass',
  projectId: 'koblenz.sozialpass.app',
  publisherText: buildConfigKoblenz.common.publisherText,
  staticQrCodesEnabled: true,
  card: {
    nameColumnName: QUERY_PARAM_NAME,
    expiryColumnName: 'Ablaufdatum',
    extensionColumnNames: [QUERY_PARAM_BIRTHDAY, QUERY_PARAM_KOBLENZ_REFERENCE_NUMBER],
    defaultValidity: { years: 1 },
    extensions: [BirthdayExtension, KoblenzReferenceNumberExtension],
  },
  dataPrivacyHeadline:
    'Datenschutzerklärung für die Nutzung und Aktivierung des digitalen KoblenzPasses',
  dataPrivacyContent: DataPrivacyBaseText,
  timezone: 'Europe/Berlin',
  pdf: {
    title: 'KoblenzPass',
    templatePath: pdfTemplate,
    customFont: 'ArialMT',
    customBoldFont: 'Arial-BoldMT',
    issuer: 'Stadt Koblenz',
    elements: {
      staticVerificationQrCodes: [{ x: 152, y: 230, size: 34 }],
      dynamicActivationQrCodes: [{ x: 130, y: 103, size: 54 }],
      text: [
        {
          x: 109,
          y: 254,
          maxWidth: 80,
          fontSize: 9,
          bold: true,
          spacing: 13,
          infoToText: renderPdfDetails,
        },
      ],
      deepLinkArea: { x: 130, y: 103, size: 54 },
    },
  },
  csvExport: {
    enabled: false,
  },
  activation: {
    activationText: ActivationText,
    downloadLink: 'https://download.koblenz.sozialpass.app/',
  },
  cardStatistics: { enabled: false },
  freinetCSVImportEnabled: false,
  freinetDataTransferEnabled: false,
  cardCreation: false,
  selfServiceEnabled: true,
  storesManagement: storesManagementConfig,
  userImportApiEnabled: true,
  showBirthdayExtensionHint: true,
  locales: buildConfigKoblenz.common.appLocales,
}
