import { rgb } from '@cantoo/pdf-lib'
import { buildConfigNuernberg } from 'build-configs'

import AddressExtensions from '../../cards/extensions/AddressFieldExtensions'
import BirthdayExtension from '../../cards/extensions/BirthdayExtension'
import NuernbergPassIdExtension from '../../cards/extensions/NuernbergPassIdExtension'
import RegionExtension from '../../cards/extensions/RegionExtension'
import StartDayExtension from '../../cards/extensions/StartDayExtension'
import { commonColors } from '../common/colors'
import type { ProjectConfig } from '../index'
import { storesManagementConfig } from '../storesManagementConfig'
import ActivityLogEntry from './ActivityLogEntry'
import { buildCsvLine } from './csvExport'
import { DataPrivacyBaseText } from './dataPrivacy'
import { createAddressFormFields, renderCardHash, renderPassId, renderPdfDetails } from './pdf'
import pdfTemplate from './pdf-template.pdf'

export const config: ProjectConfig = {
  colorPalette: commonColors,
  name: 'Digitaler Nürnberg-Pass',
  projectId: 'nuernberg.sozialpass.app',
  publisherText: buildConfigNuernberg.common.publisherText,
  staticQrCodesEnabled: true,
  card: {
    nameColumnName: 'Name',
    expiryColumnName: 'Ablaufdatum',
    extensionColumnNames: [
      'Startdatum',
      'Geburtsdatum',
      'Pass-ID',
      'Adresszeile 1',
      'Adresszeile 2',
      'PLZ',
      'Ort',
      null,
    ],
    defaultValidity: { years: 1 },
    extensions: [
      StartDayExtension,
      BirthdayExtension,
      NuernbergPassIdExtension,
      ...AddressExtensions,
      RegionExtension,
    ],
  },
  dataPrivacyHeadline:
    'Datenschutzerklärung für die Nutzung und Beantragung des digitalen Nürnberg-Pass',
  dataPrivacyContent: DataPrivacyBaseText,
  timezone: 'Europe/Berlin',
  activityLogConfig: {
    columnNames: ['Erstellt', 'Name', 'Pass-ID', 'Geburtstag', 'Gültig bis'],
    renderLogEntry: ActivityLogEntry,
  },
  pdf: {
    title: 'Nürnberg-Pässe',
    templatePath: pdfTemplate,
    issuer: 'Stadt Nürnberg',
    customFont: 'Helvetica', // URL.parse(`${process.env.PUBLIC_URL}/fonts/inter/Inter-Regular.ttf`),
    elements: {
      staticVerificationQrCodes: [
        { x: 53, y: 222, size: 47 },
        { x: 164, y: 243, size: 21 },
      ],
      dynamicActivationQrCodes: [{ x: 122, y: 110, size: 63 }],
      text: [
        { x: 108, y: 243, maxWidth: 52, fontSize: 9, spacing: 5, infoToText: renderPdfDetails },
        {
          x: 135,
          y: 85,
          maxWidth: 44,
          fontSize: 13,
          color: rgb(0.17, 0.17, 0.2),
          infoToText: renderPassId,
        },
        { x: 153.892, y: 178, fontSize: 6, textAlign: 'center', infoToText: renderCardHash },
      ],
      form: [
        { infoToFormFields: createAddressFormFields, x: 18.5, y: 68.5, width: 57, fontSize: 10 },
      ],
    },
  },
  csvExport: {
    enabled: true,
    csvHeader: [
      'Name',
      'AddressLine1',
      'AddressLine2',
      'AddressLocation',
      'PassId',
      'Birthday',
      'StartDate',
      'ExpirationDate',
      'CardHash',
      'ActivationCode',
      'StaticUserCode',
    ],
    buildCsvLine,
  },
  cardStatistics: { enabled: false },
  freinetCSVImportEnabled: false,
  freinetDataTransferEnabled: false,
  cardCreation: true,
  selfServiceEnabled: false,
  storesManagement: storesManagementConfig,
  userImportApiEnabled: false,
  showBirthdayExtensionHint: false,
  locales: buildConfigNuernberg.common.appLocales,
}
