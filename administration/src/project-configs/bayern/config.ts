import { buildConfigBayern } from 'build-configs'

import BavariaCardTypeExtension from '../../cards/extensions/BavariaCardTypeExtension'
import EMailNotificationExtension from '../../cards/extensions/EMailNotificationExtension'
import RegionExtension from '../../cards/extensions/RegionExtension'
import { findValue, JsonField } from '../../components/JsonFieldView'
import { BavariaCardType } from '../../generated/card_pb'
import {
  ApplicationDataIncompleteError,
  getCardTypeApplicationData,
  getPersonalApplicationData
} from '../../routes/applications/utils/applicationDataHelper'
import PlainDate from '../../util/PlainDate'
import { ActivationText } from '../common/ActivationText'
import { commonColors } from '../common/colors'
import type { CardConfig, InfoParams, ProjectConfig } from '../index'
import { DataPrivacyAdditionalBaseText, DataPrivacyBaseText } from './dataPrivacy'
import pdfTemplate from './pdf-template.pdf'

const renderPdfInfo = ({ info, region }: InfoParams): string => {
  const expirationDay = info.expirationDay ?? 0
  const expirationDate =
    expirationDay > 0 ? PlainDate.fromDaysSinceEpoch(expirationDay).format() : 'unbegrenzt'
  const cardType = info.extensions?.extensionBavariaCardType?.cardType

  return `${info.fullName}
Kartentyp: ${cardType === BavariaCardType.STANDARD ? 'Blau' : 'Gold'}
Gültig bis: ${expirationDate}
Ausgestellt am ${PlainDate.fromLocalDate(new Date()).format()} 
${region ? `von ${region.prefix} ${region.name}` : ''}`
}

const renderCardHash = ({ cardInfoHash }: InfoParams): string => cardInfoHash

const cardConfig: CardConfig = {
  defaultValidity: { years: 3 },
  nameColumnName: 'Name',
  expiryColumnName: 'Ablaufdatum',
  extensionColumnNames: ['Kartentyp', null, 'MailNotification'],
  extensions: [BavariaCardTypeExtension, RegionExtension, EMailNotificationExtension],
}

export const applicationJsonToPersonalData = (
  json: JsonField<'Array'>,
): { forenames?: string; surname?: string; emailAddress?: string } | null => {
  const personalData = findValue(json, 'personalData', 'Array')

  if (!personalData) {
    throw new ApplicationDataIncompleteError('Missing personal data')
  }

  const { forenames, surname, emailAddress } = getPersonalApplicationData(json)

  return { forenames, surname, emailAddress }
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
    const cardTypeExtensionIdx = cardConfig.extensions.findIndex(
      ext => ext === BavariaCardTypeExtension,
    )
    const value = cardType === 'Goldene Ehrenamtskarte' ? 'Goldkarte' : 'Standard'
    query.set(cardConfig.extensionColumnNames[cardTypeExtensionIdx] ?? '', value)
    if (personalData.emailAddress) {
      const applicantMailNotificationExtensionIdx = cardConfig.extensions.findIndex(
        ext => ext === EMailNotificationExtension,
      )
      query.set(
        cardConfig.extensionColumnNames[applicantMailNotificationExtensionIdx] ?? '',
        personalData.emailAddress,
      )
    }

    return `?${query.toString()}`
  } catch (error) {
    if (error instanceof ApplicationDataIncompleteError) {
      console.error(`Application data incomplete: ${error.message}`)
    }
    return null
  }
}

export const config: ProjectConfig = {
  colorPalette: commonColors,
  name: 'Ehrenamtskarte Bayern',
  projectId: 'bayern.ehrenamtskarte.app',
  publisherText: buildConfigBayern.common.publisherText,
  applicationFeature: {
    applicationJsonToPersonalData,
    applicationJsonToCardQuery,
    applicationUsableWithApiToken: true,
    csvExport: true,
  },
  staticQrCodesEnabled: false,
  card: cardConfig,
  dataPrivacyHeadline: 'Datenschutzerklärung für die Nutzung und Beantragung der digitalen bayerischen Ehrenamtskarte',
  dataPrivacyContent: DataPrivacyBaseText,
  dataPrivacyAdditionalBaseContent: DataPrivacyAdditionalBaseText,
  activation: {
    activationText: ActivationText,
    downloadLink: 'https://download.bayern.ehrenamtskarte.app/',
  },
  timezone: 'Europe/Berlin',
  pdf: {
    title: 'Ehrenamtskarten',
    templatePath: pdfTemplate,
    issuer: 'Bayerische Staatsministerium für Arbeit und Soziales, Familie und Integration',
    customFont: 'Inter-Regular',
    elements: {
      dynamicActivationQrCodes: [{ x: 140, y: 73, size: 51 }],
      text: [
        { x: 142, y: 137, maxWidth: 84, fontSize: 10, spacing: 4, infoToText: renderPdfInfo },
        { x: 165, y: 129, fontSize: 6, textAlign: 'center', infoToText: renderCardHash },
      ],
      deepLinkArea: { x: 140, y: 73, size: 51 },
    },
  },
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
  freinetDataTransferEnabled: false,
  cardCreation: true,
  selfServiceEnabled: false,
  storesManagement: {
    enabled: false,
  },
  userImportApiEnabled: false,
  showBirthdayExtensionHint: false,
  locales: buildConfigBayern.common.appLocales,
}
