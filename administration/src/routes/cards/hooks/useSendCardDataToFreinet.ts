import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'

import getMessageFromApolloError from '../../../errors/getMessageFromApolloError'
import {
  FreinetCardWithUserIdInput,
  useSendCardDataToFreinetMutation,
} from '../../../generated/graphql'

const useSendCardDataToFreinet = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation('cards')

  const [sendCardDataToFreinet] = useSendCardDataToFreinetMutation({
    onCompleted: data => {
      const successCount = data.sendCardDataToFreinet.successCount
      const failedUserIds = data.sendCardDataToFreinet.failedUserIds
      const totalCount = successCount + failedUserIds.length
      if (successCount === 1 && totalCount === 1) {
        enqueueSnackbar(t('freinetCardDataTransferSuccessMessage'), {
          variant: 'success',
        })
      } else if (successCount > 0) {
        enqueueSnackbar(
          t('multipleFreinetCardDataTransferSuccessMessage', { count: successCount }),
          {
            variant: 'success',
          },
        )
      }

      if (failedUserIds.length === 1 && totalCount === 1) {
        enqueueSnackbar(t('freinetCardDataTransferFailureMessage'), {
          variant: 'error',
          persist: true,
        })
      } else if (failedUserIds.length > 0) {
        enqueueSnackbar(
          t('multipleFreinetCardDataTransferFailureMessage', {
            userIds: failedUserIds.join(', '),
          }),
          { variant: 'error', persist: true },
        )
      }
    },
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      enqueueSnackbar(title, { variant: 'error', persist: true })
    },
  })

  return (freinetCards: FreinetCardWithUserIdInput[]): void => {
    if (freinetCards.length > 0) {
      sendCardDataToFreinet({ variables: { freinetCards } })
    }
  }
}

export default useSendCardDataToFreinet
