import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Card } from '../../../cards/Card'
import { CreateCardsResult } from '../../../cards/createCards'
import { EMAIL_NOTIFICATION_EXTENSION_NAME } from '../../../cards/extensions/EMailNotificationExtension'
import getMessageFromApolloError from '../../../errors/getMessageFromApolloError'
import { useSendCardCreationConfirmationMailMutation } from '../../../generated/graphql'
import { getBuildConfig } from '../../../util/getBuildConfig'
import getDeepLinkFromQrCode from '../../../util/getDeepLinkFromQrCode'
import { isProductionEnvironment } from '../../../util/helper'
import { useAppToaster } from '../../AppToaster'

type SendCardConfirmationMail = (codes: CreateCardsResult[], cards: Card[]) => Promise<void>

const useSendCardConfirmationMails = (): SendCardConfirmationMail => {
  const { t } = useTranslation('cards')
  const appToaster = useAppToaster()
  const [sendMail] = useSendCardCreationConfirmationMailMutation({
    onCompleted: () => {
      appToaster?.show({ intent: 'success', message: t('cards:cardCreationConfirmationMessage') })
    },
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({
        intent: 'danger',
        message: title,
        timeout: 0,
      })
    },
  })

  return useCallback(
    async (codes: CreateCardsResult[], cards: Card[]): Promise<void> => {
      await Promise.all(
        codes.map(async (code, index) => {
          const card = cards[index]
          const mailNotificationExtensionState = card.extensions[EMAIL_NOTIFICATION_EXTENSION_NAME]
          const regionId = code.dynamicActivationCode.info?.extensions?.extensionRegion?.regionId
          if (!mailNotificationExtensionState || regionId === undefined) {
            return
          }
          const deepLink = getDeepLinkFromQrCode(
            { case: 'dynamicActivationCode', value: code.dynamicActivationCode },
            getBuildConfig(window.location.hostname),
            isProductionEnvironment()
          )
          await sendMail({
            variables: {
              regionId,
              recipientAddress: mailNotificationExtensionState,
              recipientName: card.fullName,
              deepLink,
            },
          })
        })
      )
    },
    [sendMail]
  )
}

export default useSendCardConfirmationMails
