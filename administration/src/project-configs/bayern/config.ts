import { JsonField, findValue } from '../../bp-modules/applications/JsonFieldView'
import BavariaCardTypeExtension from '../../cards/extensions/BavariaCardTypeExtension'
import RegionExtension from '../../cards/extensions/RegionExtension'
import { ProjectConfig } from '../getProjectConfig'
import { DataPrivacyAdditionalBaseText, DataPrivacyBaseText, dataPrivacyBaseHeadline } from './dataPrivacyBase'
import pdfConfiguration from './pdf'

export const applicationJsonToCardQuery = (json: JsonField<'Array'>): string | null => {
  const query = new URLSearchParams()
  const personalData = findValue(json, 'personalData', 'Array')
  const cardType = findValue(json, 'cardType', 'String')

  if (!personalData) {
    return null
  }

  const forenames = findValue(personalData, 'forenames', 'String')
  const surname = findValue(personalData, 'surname', 'String')

  if (!forenames || !surname || !cardType) {
    return null
  }

  query.set(config.card.nameColumnName, forenames.value + ' ' + surname.value)
  const cardTypeExtensionIdx = config.card.extensions.findIndex(ext => ext === BavariaCardTypeExtension)
  const value = cardType.value === 'Goldene Ehrenamtskarte' ? 'Goldkarte' : 'Standard'
  query.set(config.card.extensionColumnNames[cardTypeExtensionIdx] ?? '', value)

  return '?' + query.toString()
}

const config: ProjectConfig = {
  name: 'Ehrenamtskarte Bayern',
  projectId: 'bayern.ehrenamtskarte.app',
  applicationFeature: {
    applicationJsonToCardQuery,
  },
  staticQrCodesEnabled: false,
  card: {
    defaultValidity: { years: 3 },
    nameColumnName: 'Name',
    expiryColumnName: 'Ablaufdatum',
    extensionColumnNames: ['Kartentyp', null],
    extensions: [BavariaCardTypeExtension, RegionExtension],
  },
  dataPrivacyHeadline: dataPrivacyBaseHeadline,
  dataPrivacyContent: DataPrivacyBaseText,
  dataPrivacyAdditionalBaseContent: DataPrivacyAdditionalBaseText,
  timezone: 'Europe/Berlin',
  pdf: pdfConfiguration,
}

export default config
