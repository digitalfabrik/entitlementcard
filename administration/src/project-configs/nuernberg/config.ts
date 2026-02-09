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
import { DataPrivacyBaseText, dataPrivacyBaseHeadline } from './dataPrivacyBase'
import pdfConfig from './pdf'

const config: ProjectConfig = {
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
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
  dataPrivacyContent: DataPrivacyBaseText,
  timezone: 'Europe/Berlin',
  activityLogConfig: {
    columnNames: ['Erstellt', 'Name', 'Pass-ID', 'Geburtstag', 'Gültig bis'],
    renderLogEntry: ActivityLogEntry,
  },
  pdf: pdfConfig,
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

export default config
