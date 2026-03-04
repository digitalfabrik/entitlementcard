import BavariaCardTypeExtension from '../../cards/extensions/BavariaCardTypeExtension'
import EMailNotificationExtension from '../../cards/extensions/EMailNotificationExtension'
import { JsonField, findValue } from '../../components/JsonFieldView'
import {
  ApplicationDataIncompleteError,
  getCardTypeApplicationData,
  getPersonalApplicationData,
} from '../../routes/applications/utils/applicationDataHelper'
import { config } from '../bayern/config'

export const applicationJsonToPersonalData = (
  json: JsonField<'Array'>,
): { forenames?: string; surname?: string; emailAddress?: string } => {
  const personalData = findValue(json, 'personalData', 'Array')

  if (!personalData) {
    throw new ApplicationDataIncompleteError('Missing personal data')
  }

  return getPersonalApplicationData(json)
}

export const applicationJsonToCardQuery = (json: JsonField<'Array'>): string | null => {
  const query = new URLSearchParams()

  try {
    const { cardType } = getCardTypeApplicationData(json)
    const personalData = applicationJsonToPersonalData(json)

    if (!personalData.forenames || !personalData.surname || !cardType) {
      throw new ApplicationDataIncompleteError('Missing personal data')
    }

    query.set(config.card.nameColumnName, `${personalData.forenames} ${personalData.surname}`)
    const cardTypeExtensionIdx = config.card.extensions.findIndex(
      ext => ext === BavariaCardTypeExtension,
    )
    // TODO Move these constants to a universal place
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
