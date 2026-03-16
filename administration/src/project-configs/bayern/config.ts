/* eslint-disable @typescript-eslint/no-use-before-define */
import { buildConfigBayern } from 'build-configs'
import { Temporal } from 'temporal-polyfill'

import BavariaCardTypeExtension from '../../cards/extensions/BavariaCardTypeExtension'
import EMailNotificationExtension from '../../cards/extensions/EMailNotificationExtension'
import FreinetUserIdExtension from '../../cards/extensions/FreinetUserIdExtension'
import RegionExtension from '../../cards/extensions/RegionExtension'
import { JsonField, findValue } from '../../components/JsonFieldView'
import {
  ApplicationDataIncompleteError,
  getCardTypeApplicationData,
  getPersonalApplicationData,
} from '../../routes/applications/utils/applicationDataHelper'
import { ActivationText } from '../common/ActivationText'
import { commonColors } from '../common/colors'
import type { InfoParams, ProjectConfig } from '../index'
import { DataPrivacyAdditionalBaseText, DataPrivacyBaseText } from './dataPrivacy'
import { renderPdfInfo } from './pdf'
import pdfTemplate from './pdf-template.pdf'

const renderCardHash = ({ cardInfoHash }: InfoParams): string => cardInfoHash

const applicationJsonToPersonalData = (
  json: JsonField<'Array'>,
): { forenames?: string; surname?: string; emailAddress?: string } | null => {
  const personalData = findValue(json, 'personalData', 'Array')

  if (!personalData) {
    throw new ApplicationDataIncompleteError('Missing personal data')
  }

  const { forenames, surname, emailAddress } = getPersonalApplicationData(json)

  return { forenames, surname, emailAddress }
}

const applicationJsonToCardQuery = (json: JsonField<'Array'>): string | null => {
  const query = new URLSearchParams()
  try {
    const { cardType } = getCardTypeApplicationData(json)

    const personalData = applicationJsonToPersonalData(json)

    if (!personalData || !personalData.forenames || !personalData.surname || !cardType) {
      throw new ApplicationDataIncompleteError('Missing personal data')
    }

    query.set(config.card.nameColumnName, `${personalData.forenames} ${personalData.surname}`)
    const cardTypeExtensionIdx = config.card.extensions.findIndex(
      ext => ext === BavariaCardTypeExtension,
    )
    const value = cardType === 'Goldene Ehrenamtskarte' ? 'Goldkarte' : 'Standard'
    query.set(config.card.extensionColumnNames[cardTypeExtensionIdx] ?? '', value)
    if (personalData.emailAddress) {
      const applicantMailNotificationExtensionIdx = config.card.extensions.findIndex(
        ext => ext === EMailNotificationExtension,
      )
      query.set(
        config.card.extensionColumnNames[applicantMailNotificationExtensionIdx] ?? '',
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
  card: {
    defaultValidity: Temporal.Duration.from({ years: 3 }),
    nameColumnName: 'Name',
    expiryColumnName: 'Ablaufdatum',
    extensionColumnNames: ['Kartentyp', null, 'MailNotification'],
    extensions: [BavariaCardTypeExtension, RegionExtension, EMailNotificationExtension],
  },
  dataPrivacyHeadline:
    'Datenschutzerklärung für die Nutzung und Beantragung der digitalen bayerischen Ehrenamtskarte',
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
    customFont: URL.parse('./fonts/inter/Inter-Regular.ttf', window.location.origin),
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
  freinetDataTransferEnabled: true,
  cardCreation: true,
  selfServiceEnabled: false,
  storesManagement: {
    enabled: false,
  },
  userImportApiEnabled: false,
  showBirthdayExtensionHint: false,
  locales: buildConfigBayern.common.appLocales,
}
