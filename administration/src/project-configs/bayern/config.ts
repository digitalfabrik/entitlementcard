import { JsonField, findValue } from '../../bp-modules/applications/JsonFieldView'
import BavariaCardTypeExtension from '../../cards/extensions/BavariaCardTypeExtension'
import EMailNotificationExtension from '../../cards/extensions/EMailNotificationExtension'
import RegionExtension from '../../cards/extensions/RegionExtension'
import { ProjectConfig } from '../getProjectConfig'
import { ActivationText } from './activationText'
import { DataPrivacyAdditionalBaseText, DataPrivacyBaseText, dataPrivacyBaseHeadline } from './dataPrivacyBase'
import pdfConfiguration from './pdf'

export const applicationJsonToPersonalData = (
  json: JsonField<'Array'>
): { forenames?: string; surname?: string; emailAddress?: string } | null => {
  const personalData = findValue(json, 'personalData', 'Array')

  if (!personalData) {
    return null
  }

  const forenames = findValue(personalData, 'forenames', 'String')
  const surname = findValue(personalData, 'surname', 'String')
  const emailAddress = findValue(personalData, 'emailAddress', 'String')

  return { forenames: forenames?.value, surname: surname?.value, emailAddress: emailAddress?.value }
}

export const applicationJsonToCardQuery = (json: JsonField<'Array'>): string | null => {
  const query = new URLSearchParams()
  const applicationDetails = findValue(json, 'applicationDetails', 'Array') ?? json
  const cardType = findValue(applicationDetails, 'cardType', 'String')

  const personalData = applicationJsonToPersonalData(json)

  if (!personalData || !personalData.forenames || !personalData.surname || !cardType) {
    return null
  }

  query.set(config.card.nameColumnName, `${personalData.forenames} ${personalData.surname}`)
  const cardTypeExtensionIdx = config.card.extensions.findIndex(ext => ext === BavariaCardTypeExtension)
  const value = cardType.value === 'Goldene Ehrenamtskarte' ? 'Goldkarte' : 'Standard'
  query.set(config.card.extensionColumnNames[cardTypeExtensionIdx] ?? '', value)
  if (personalData.emailAddress) {
    const applicantMailNotificationExtensionIdx = config.card.extensions.findIndex(
      ext => ext === EMailNotificationExtension
    )
    query.set(config.card.extensionColumnNames[applicantMailNotificationExtensionIdx] ?? '', personalData.emailAddress)
  }

  return `?${query.toString()}`
}

const config: ProjectConfig = {
  name: 'Ehrenamtskarte Bayern',
  projectId: 'bayern.ehrenamtskarte.app',
  applicationFeature: {
    applicationJsonToPersonalData,
    applicationJsonToCardQuery,
  },
  staticQrCodesEnabled: false,
  card: {
    defaultValidity: { years: 3 },
    nameColumnName: 'Name',
    expiryColumnName: 'Ablaufdatum',
    extensionColumnNames: ['Kartentyp', null, 'MailNotification'],
    extensions: [BavariaCardTypeExtension, RegionExtension, EMailNotificationExtension],
  },
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
  dataPrivacyContent: DataPrivacyBaseText,
  dataPrivacyAdditionalBaseContent: DataPrivacyAdditionalBaseText,
  activation: {
    activationText: ActivationText,
    downloadLink: 'https://download.bayern.ehrenamtskarte.app/',
  },
  timezone: 'Europe/Berlin',
  pdf: pdfConfiguration,
  csvExport: {
    enabled: false,
  },
  cardStatistics: {
    enabled: true,
    theme: {
      primaryColor: '#8377A9',
      // https://a.atmos.washington.edu/~ovens/javascript/colorpicker.html - 80% lighter than primaryColor
      primaryColorLight: '#c6c0d8',
    },
  },
  cardCreation: true,
  storeManagement: {
    enabled: false,
  },
}

export default config
