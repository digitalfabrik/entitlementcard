import { ApolloError } from '@apollo/client'
import { useCallback, useContext, useState } from 'react'

import { generatePdf } from '../../../cards/PdfFactory'
import SelfServiceCard from '../../../cards/SelfServiceCard'
import { CreateCardsError, CreateCardsResult } from '../../../cards/createCards'
import getMessageFromApolloError from '../../../errors/getMessageFromApolloError'
import { DynamicActivationCode, StaticVerificationCode } from '../../../generated/card_pb'
import { useCreateCardsFromSelfServiceMutation } from '../../../generated/graphql'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import { ProjectConfig } from '../../../project-configs/getProjectConfig'
import { base64ToUint8Array, uint8ArrayToBase64 } from '../../../util/base64'
import downloadDataUri from '../../../util/downloadDataUri'
import getCustomDeepLinkFromQrCode from '../../../util/getCustomDeepLinkFromQrCode'
import { useAppToaster } from '../../AppToaster'
import { getHeaders } from '../../cards/ImportCardsController'
import { CardActivationState } from '../../cards/hooks/useCardGenerator'

const initializeCardBlueprintForProject = (projectConfig: ProjectConfig): SelfServiceCard => {
  const headers = getHeaders(projectConfig)
  const selfServiceCard = new SelfServiceCard('', projectConfig.card)
  headers.forEach(header => {
    selfServiceCard.setValue(header, '')
  })
  return selfServiceCard
}

const useCardGeneratorSelfService = () => {
  const projectConfig = useContext(ProjectConfigContext)
  const appToaster = useAppToaster()
  const [selfServiceCards, setSelfServiceCards] = useState<SelfServiceCard[]>([
    initializeCardBlueprintForProject(projectConfig),
  ])
  const [activationState, setActivationState] = useState(CardActivationState.input)
  const [deepLink, setDeepLink] = useState<string>('')
  const [code, setCode] = useState<CreateCardsResult | null>(null)
  const [createCardsSelfService] = useCreateCardsFromSelfServiceMutation()

  const handleErrors = useCallback(
    (error: unknown) => {
      if (error instanceof CreateCardsError) {
        appToaster?.show({
          message: error.message,
          intent: 'danger',
        })
      }
      if (error instanceof ApolloError) {
        const { title } = getMessageFromApolloError(error)
        appToaster?.show({
          message: title,
          intent: 'danger',
        })
      } else {
        appToaster?.show({
          message: 'Unbekannter Fehler: Etwas ist schiefgegangen.',
          intent: 'danger',
        })
      }
      setActivationState(CardActivationState.input)
    },
    [appToaster]
  )

  const generateCards = useCallback(async () => {
    setActivationState(CardActivationState.loading)

    try {
      const cardInfo = selfServiceCards[0].generateCardInfo()
      const result = await createCardsSelfService({
        variables: {
          project: projectConfig.projectId,
          generateStaticCodes: true,
          encodedCardInfo: uint8ArrayToBase64(cardInfo.toBinary()),
        },
      })

      if (result.errors) {
        const { title } = getMessageFromApolloError(new ApolloError({ graphQLErrors: result.errors }))
        throw new CreateCardsError(title)
      }
      if (!result.data) {
        throw new CreateCardsError('Beim Erstellen der Karte(n) ist ein Fehler aufgetreten.')
      }
      const cardResult = result.data.card
      const dynamicActivationCode = DynamicActivationCode.fromBinary(
        base64ToUint8Array(cardResult.dynamicActivationCode.codeBase64)
      )
      const staticVerificationCode = cardResult.staticVerificationCode
        ? StaticVerificationCode.fromBinary(base64ToUint8Array(cardResult.staticVerificationCode.codeBase64))
        : undefined
      const code = {
        dynamicActivationCode,
        staticVerificationCode,
        staticCardInfoHashBase64: cardResult.staticVerificationCode?.cardInfoHashBase64,
        dynamicCardInfoHashBase64: cardResult.dynamicActivationCode.cardInfoHashBase64,
      }
      setCode(code)
      setDeepLink(
        getCustomDeepLinkFromQrCode({
          case: 'dynamicActivationCode',
          value: code.dynamicActivationCode,
        })
      )

      setActivationState(CardActivationState.finished)
    } catch (error) {
      handleErrors(error)
    }
  }, [selfServiceCards, projectConfig])

  const downloadPdf = async (code: CreateCardsResult, fileName: string) => {
    const blob = await generatePdf([code], selfServiceCards, projectConfig.pdf)
    downloadDataUri(blob, fileName)
  }

  return {
    activationState,
    deepLink,
    code,
    selfServiceCards,
    setSelfServiceCards,
    generateCards,
    downloadPdf,
  }
}
export default useCardGeneratorSelfService
