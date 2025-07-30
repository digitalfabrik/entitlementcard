import { JsonField, findValue } from '../../bp-modules/applications/JsonFieldView'
import BavariaCardTypeExtension from '../../cards/extensions/BavariaCardTypeExtension'
import EMailNotificationExtension from '../../cards/extensions/EMailNotificationExtension'
import RegionExtension from '../../cards/extensions/RegionExtension'
import {
  ApplicationDataIncompleteError,
  getCardTypeApplicationData,
  getPersonalApplicationData,
} from '../../util/applicationDataHelper'
import { ActivationText } from '../common/ActivationText'
import type { CardConfig, ProjectConfig } from '../getProjectConfig'
import { DataPrivacyAdditionalBaseText, DataPrivacyBaseText, dataPrivacyBaseHeadline } from './dataPrivacyBase'
import pdfConfiguration from './pdf'

export const applicationJsonToPersonalData = (
  json: JsonField<'Array'>
): { forenames?: string; surname?: string; emailAddress?: string } | null => {
  const personalData = findValue(json, 'personalData', 'Array')

  if (!personalData) {
    throw new ApplicationDataIncompleteError('Missing personal data')
  }

  const { forenames, surname, emailAddress } = getPersonalApplicationData(json)

  return { forenames, surname, emailAddress }
}

const cardConfig: CardConfig = {
  defaultValidity: { years: 3 },
  nameColumnName: 'Name',
  expiryColumnName: 'Ablaufdatum',
  extensionColumnNames: ['Kartentyp', null, 'MailNotification'],
  extensions: [BavariaCardTypeExtension, RegionExtension, EMailNotificationExtension],
}

export const applicationJsonToCardQuery = (json: JsonField<'Array'>): string | null => {
  const query = new URLSearchParams()
  try {
    const { cardType } = getCardTypeApplicationData(json)

    const personalData = applicationJsonToPersonalData(json)

    if (!personalData || !personalData.forenames || !personalData.surname || !cardType) {
      throw new ApplicationDataIncompleteError('Missing personal data')
    }

    query.set(cardConfig.nameColumnName, `${personalData.forenames} ${personalData.surname}`)
    const cardTypeExtensionIdx = cardConfig.extensions.findIndex(ext => ext === BavariaCardTypeExtension)
    const value = cardType === 'Goldene Ehrenamtskarte' ? 'Goldkarte' : 'Standard'
    query.set(cardConfig.extensionColumnNames[cardTypeExtensionIdx] ?? '', value)
    if (personalData.emailAddress) {
      const applicantMailNotificationExtensionIdx = cardConfig.extensions.findIndex(
        ext => ext === EMailNotificationExtension
      )
      query.set(cardConfig.extensionColumnNames[applicantMailNotificationExtensionIdx] ?? '', personalData.emailAddress)
    }

    return `?${query.toString()}`
  } catch (error) {
    if (error instanceof ApplicationDataIncompleteError) {
      console.error(`Application data incomplete: ${error.message}`)
    }
    return null
  }
}

const config: ProjectConfig = {
  name: 'Ehrenamtskarte Bayern',
  projectId: 'bayern.ehrenamtskarte.app',
  applicationFeature: {
    applicationJsonToPersonalData,
    applicationJsonToCardQuery,
    applicationUsableWithApiToken: true,
    csvExport: true,
  },
  staticQrCodesEnabled: false,
  card: cardConfig,
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
      colorCardCreated: '#D9D9D9',
      colorActivatedCard: '#C6C0D8',
      colorActivatedBlueCard: '#3B82F6',
      colorActivatedGoldenCard: '#EFBF04',
    },
  },
  freinetCSVImportEnabled: true,
  freinetDataTransferEnabled: true,
  cardCreation: true,
  selfServiceEnabled: false,
  storesManagement: {
    enabled: false,
  },
  userImportApiEnabled: false,
  showBirthdayExtensionHint: false,
}

export default config
