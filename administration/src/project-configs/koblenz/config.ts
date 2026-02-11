import {
  QUERY_PARAM_BIRTHDAY,
  QUERY_PARAM_KOBLENZ_REFERENCE_NUMBER,
  QUERY_PARAM_NAME,
  buildConfigKoblenz,
} from 'build-configs'

import BirthdayExtension from '../../cards/extensions/BirthdayExtension'
import KoblenzReferenceNumberExtension from '../../cards/extensions/KoblenzReferenceNumberExtension'
import PlainDate from '../../util/PlainDate'
import { ActivationText } from '../common/ActivationText'
import { commonColors } from '../common/colors'
import type { InfoParams, ProjectConfig } from '../index'
import { storesManagementConfig } from '../storesManagementConfig'
import colorsOverride from './colorsOverride'
import { DataPrivacyBaseText, dataPrivacyBaseHeadline } from './dataPrivacyBase'
import pdfTemplate from './pdf-template.pdf'

const renderPdfDetails = ({ info }: InfoParams): string => {
  const expirationDay = info.expirationDay

  if (expirationDay === undefined) {
    throw new Error('expirationDay must be defined for Koblenz')
  }

  const expirationDate = PlainDate.fromDaysSinceEpoch(expirationDay)
  const birthdayDate = PlainDate.fromDaysSinceEpoch(
    info.extensions?.extensionBirthday?.birthday ?? 0,
  )
  const startDate = PlainDate.fromDaysSinceEpoch(info.extensions?.extensionStartDay?.startDay ?? 0)

  return `${startDate.format()} - ${expirationDate.format()}
${birthdayDate.format()}
${info.fullName}`
}

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
    defaultValidity: { years: 1 },
    extensions: [BirthdayExtension, KoblenzReferenceNumberExtension],
  },
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
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
