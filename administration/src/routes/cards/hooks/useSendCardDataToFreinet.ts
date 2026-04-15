import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'urql'

import { messageFromGraphQlError } from '../../../errors'
import { FreinetCardWithUserIdInput, SendCardDataToFreinetDocument } from '../../../graphql'

const useSendCardDataToFreinet = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation('cards')
  const [, sendCardDataToFreinetMutation] = useMutation(SendCardDataToFreinetDocument)

  return async (freinetCards: FreinetCardWithUserIdInput[]): Promise<void> => {
    if (freinetCards.length > 0) {
      const result = await sendCardDataToFreinetMutation({ freinetCards })

      if (result.error) {
        const { title } = messageFromGraphQlError(result.error)
        enqueueSnackbar(title, { variant: 'error', persist: true })
      } else if (result.data) {
        const successCount = result.data.sendCardDataToFreinet.successCount
        const failedUserIds = result.data.sendCardDataToFreinet.failedUserIds
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
      }
    }
  }
}

export default useSendCardDataToFreinet
