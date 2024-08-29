import BirthdayExtension from '../../cards/extensions/BirthdayExtension'
import RegionExtension from '../../cards/extensions/RegionExtension'
import StartDayExtension from '../../cards/extensions/StartDayExtension'
import { ProjectConfig } from '../getProjectConfig'
import { DataPrivacyBaseText, dataPrivacyBaseHeadline } from './dataPrivacyBase'
import pdfConfig from './pdf'

const config: ProjectConfig = {
  name: 'Digitaler Koblenz-Pass',
  projectId: 'koblenz.sozialpass.app',
  staticQrCodesEnabled: true,
  card: {
    nameColumnName: 'Name',
    expiryColumnName: 'Ablaufdatum',
    extensionColumnNames: ['Startdatum', 'Geburtsdatum', null],
    defaultValidity: { years: 1 },
    extensions: [StartDayExtension, BirthdayExtension, RegionExtension],
  },
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
  dataPrivacyContent: DataPrivacyBaseText,
  timezone: 'Europe/Berlin',
  pdf: pdfConfig,
  csvExport: {
    enabled: false,
  },
  cardStatistics: { enabled: false },
  freinetCSVImportEnabled: false,
  cardCreation: false,
  storeManagement: {
    enabled: false,
  },
  userUploadApiEnabled: true,
}

export default config
