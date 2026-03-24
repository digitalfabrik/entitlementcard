import { useSnackbar } from 'notistack'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'urql'

import { Card } from '../../../cards/card'
import { CreateCardsResult } from '../../../cards/createCards'
import { EMAIL_NOTIFICATION_EXTENSION_NAME } from '../../../cards/extensions/EMailNotificationExtension'
import getDeepLinkFromQrCode from '../../../cards/getDeepLinkFromQrCode'
import messageFromGraphQlError from '../../../errors/getMessageFromApolloError'
import { Region, SendCardCreationConfirmationMailsDocument } from '../../../graphql'
import { getBuildConfig } from '../../../util/getBuildConfig'
import { isProductionEnvironment } from '../../../util/helper'

type SendCardConfirmationMail = (codes: CreateCardsResult[], cards: Card[]) => Promise<void>

const useSendCardConfirmationMails = (region: Pick<Region, 'id'>): SendCardConfirmationMail => {
  const { t } = useTranslation('cards')
  const { enqueueSnackbar } = useSnackbar()
  const [, sendConfirmationEmailMutation] = useMutation(SendCardCreationConfirmationMailsDocument)

  return useCallback(
    async (codes: CreateCardsResult[], cards: Card[]): Promise<void> => {
      const notificationData = codes.flatMap((code, index) => {
        const card = cards[index]
        const mailNotificationExtensionState = card.extensions[EMAIL_NOTIFICATION_EXTENSION_NAME]
        return mailNotificationExtensionState
          ? [
              {
                recipientAddress: mailNotificationExtensionState,
                recipientName: card.fullName,
                deepLink: getDeepLinkFromQrCode(
                  { case: 'dynamicActivationCode', value: code.dynamicActivationCode },
                  getBuildConfig(window.location.hostname),
                  isProductionEnvironment(),
                ),
              },
            ]
          : []
      })

      if (notificationData.length === 0) {
        return
      }

      const result = await sendConfirmationEmailMutation({
        regionId: region.id,
        notifications: notificationData,
      })

      if (result.error) {
        const { title } = messageFromGraphQlError(result.error)
        enqueueSnackbar(title, { variant: 'error', persist: true })
        return
      }

      const successCount = result.data?.sendCardCreationConfirmationMails.successCount ?? 0
      const failedRecipients = result.data?.sendCardCreationConfirmationMails.failedRecipients ?? []

      if (notificationData.length === 1 && successCount === 1) {
        enqueueSnackbar(t('cards:cardCreationConfirmationMessage'), {
          variant: 'success',
        })
      } else if (successCount > 0) {
        enqueueSnackbar(
          t('cards:multipleCardCreationConfirmationMessage', { count: successCount }),
          {
            variant: 'success',
          },
        )
      }

      if (notificationData.length === 1 && failedRecipients.length === 1) {
        enqueueSnackbar(t('cards:cardCreationConfirmationFailureMessage'), {
          variant: 'error',
          persist: true,
        })
      } else if (failedRecipients.length > 0) {
        enqueueSnackbar(
          t('cards:multipleCardCreationConfirmationFailureMessage', {
            recipients: failedRecipients.join(', '),
          }),
          { variant: 'error', persist: true },
        )
      }
    },
    [sendConfirmationEmailMutation, enqueueSnackbar, t, region.id],
  )
}

export default useSendCardConfirmationMails
