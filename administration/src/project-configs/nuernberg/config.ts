import { rgb } from '@cantoo/pdf-lib'
import { buildConfigNuernberg } from 'build-configs'
import { Temporal } from 'temporal-polyfill'

import type { CardInfo } from '../../card_pb'
import type { Card } from '../../cards/card'
import AddressExtensions, {
  getAddressFieldExtensionsValues,
} from '../../cards/extensions/AddressFieldExtensions'
import BirthdayExtension from '../../cards/extensions/BirthdayExtension'
import NuernbergPassIdExtension from '../../cards/extensions/NuernbergPassIdExtension'
import RegionExtension from '../../cards/extensions/RegionExtension'
import StartDayExtension from '../../cards/extensions/StartDayExtension'
import { commonColors } from '../common/colors'
import type { FormConfig, ProjectConfig } from '../index'
import { storesManagementConfig } from '../storesManagementConfig'
import ActivityLogEntry from './ActivityLogEntry'
import { buildCsvLine } from './csvExport'
import { DataPrivacyBaseText } from './dataPrivacy'
import { renderCardHash, renderPassId, renderPdfDetails } from './pdf'
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
    defaultValidity: Temporal.Duration.from({ years: 1 }),
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
    customFont: URL.parse('./fonts/inter/Inter-Regular.ttf', window.location.origin),
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
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        { createFormFields: createAddressFormFields, x: 18.5, y: 68.5, width: 57, fontSize: 10 },
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

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function createAddressFormFields(pageIndex: number, info: CardInfo, card: Card): FormConfig[] {
  const [addressLine1, addressLine2, plz, location] = getAddressFieldExtensionsValues(card)

  return [
    // Name
    {
      name: `${pageIndex}.address.name`,
      // avoid only printing the name
      text: addressLine1 || addressLine2 || plz || location ? info.fullName : undefined,
    },
    // Address field 1
    { name: `${pageIndex}.address.line.1`, text: addressLine1 },
    // Address field 2
    { name: `${pageIndex}.address.line.2`, text: addressLine2 },
    // ZIP code and location
    {
      name: `${pageIndex}.address.location`,
      text: plz && location ? `${plz} ${location}` : undefined,
    },
  ].filter(field => field.text !== undefined && field.text.trim() !== '') as FormConfig[]
}
