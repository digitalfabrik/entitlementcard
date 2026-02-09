import {
  QUERY_PARAM_BIRTHDAY,
  QUERY_PARAM_KOBLENZ_REFERENCE_NUMBER,
  QUERY_PARAM_NAME,
  buildConfigKoblenz,
} from 'build-configs'
import { Temporal } from 'temporal-polyfill'

import BirthdayExtension from '../../cards/extensions/BirthdayExtension'
import KoblenzReferenceNumberExtension from '../../cards/extensions/KoblenzReferenceNumberExtension'
import { ActivationText } from '../common/ActivationText'
import { commonColors } from '../common/colors'
import type { InfoParams, ProjectConfig } from '../index'
import { storesManagementConfig } from '../storesManagementConfig'
import colorsOverride from './colorsOverride'
import { DataPrivacyBaseText, dataPrivacyBaseHeadline } from './dataPrivacyBase'
import pdfTemplate from './pdf-template.pdf'

export const config: ProjectConfig = {
  colorPalette: { ...commonColors, ...colorsOverride },
  name: 'KoblenzPass',
  projectId: 'koblenz.sozialpass.app',
  publisherText: buildConfigKoblenz.common.publisherText,
  staticQrCodesEnabled: true,
  card: {
    nameColumnName: QUERY_PARAM_NAME,
    expiryColumnName: 'Ablaufdatum',
    extensionColumnNames: [QUERY_PARAM_BIRTHDAY, QUERY_PARAM_KOBLENZ_REFERENCE_NUMBER],
    defaultValidity: Temporal.Duration.from({ years: 1 }),
    extensions: [BirthdayExtension, KoblenzReferenceNumberExtension],
  },
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
  dataPrivacyContent: DataPrivacyBaseText,
  timezone: 'Europe/Berlin',
  pdf: {
    title: 'KoblenzPass',
    templatePath: pdfTemplate,
    customFont: 'texgyreheros-regular.ttf',
    customBoldFont: 'texgyreheros-bold.ttf',
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
          spacing: 10,
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
