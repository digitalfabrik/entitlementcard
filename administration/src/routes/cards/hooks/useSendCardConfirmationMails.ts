import { ApolloError } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Card } from '../../../cards/card'
import { CreateCardsResult } from '../../../cards/createCards'
import { EMAIL_NOTIFICATION_EXTENSION_NAME } from '../../../cards/extensions/EMailNotificationExtension'
import getDeepLinkFromQrCode from '../../../cards/getDeepLinkFromQrCode'
import getMessageFromApolloError from '../../../errors/getMessageFromApolloError'
import { useSendCardCreationConfirmationMailMutation } from '../../../generated/graphql'
import { getBuildConfig } from '../../../util/getBuildConfig'
import { isProductionEnvironment } from '../../../util/helper'

type SendCardConfirmationMail = (codes: CreateCardsResult[], cards: Card[]) => Promise<void>

const useSendCardConfirmationMails = (): SendCardConfirmationMail => {
  const { t } = useTranslation('cards')
  const { enqueueSnackbar } = useSnackbar()
  const [sendMail] = useSendCardCreationConfirmationMailMutation()

  return useCallback(
    async (codes: CreateCardsResult[], cards: Card[]): Promise<void> => {
      let successCount = 0
      const errors: ApolloError[] = []

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
            isProductionEnvironment(),
          )
          try {
            await sendMail({
              variables: {
                regionId,
                recipientAddress: mailNotificationExtensionState,
                recipientName: card.fullName,
                deepLink,
              },
            })
            successCount++
          } catch (error) {
            errors.push(error as ApolloError)
          }
        }),
      )

      if (successCount === 1) {
        enqueueSnackbar(t('cards:cardCreationConfirmationMessage'), { variant: 'success' })
      } else if (successCount > 1) {
        enqueueSnackbar(t('cards:cardCreationConfirmationMessageMultiple', { count: successCount }), {
          variant: 'success',
        })
      }

      if (errors.length === 1) {
        const { title } = getMessageFromApolloError(errors[0])
        enqueueSnackbar(title, { variant: 'error', persist: true })
      } else if (errors.length > 1) {
        enqueueSnackbar(t('cards:cardCreationConfirmationErrorMultiple', { count: errors.length }), {
          variant: 'error',
          persist: true,
        })
      }
    },
    [sendMail, enqueueSnackbar, t],
  )
}

export default useSendCardConfirmationMails
