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

export enum CardSelfServiceStep {
  form,
  information,
  activation,
}

type UseCardGeneratorSelfServiceReturn = {
  selfServiceState: CardSelfServiceStep
  setSelfServiceState: (step: CardSelfServiceStep) => void
  isLoading: boolean
  deepLink: string
  code: CreateCardsResult | null
  selfServiceCards: SelfServiceCard[]
  setSelfServiceCards: (cards: SelfServiceCard[]) => void
  generateCards: () => Promise<void>
  downloadPdf: (code: CreateCardsResult, fileName: string) => Promise<void>
}
const initializeCardBlueprintForProject = (projectConfig: ProjectConfig): SelfServiceCard => {
  const headers = getHeaders(projectConfig)
  const selfServiceCard = new SelfServiceCard('', projectConfig.card)
  headers.forEach(header => {
    selfServiceCard.setValue(header, '')
  })
  return selfServiceCard
}

const useCardGeneratorSelfService = (): UseCardGeneratorSelfServiceReturn => {
  const projectConfig = useContext(ProjectConfigContext)
  const appToaster = useAppToaster()
  const [selfServiceCards, setSelfServiceCards] = useState<SelfServiceCard[]>([
    initializeCardBlueprintForProject(projectConfig),
  ])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selfServiceState, setSelfServiceState] = useState<CardSelfServiceStep>(CardSelfServiceStep.form)
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
          timeout: 0,
        })
      } else {
        appToaster?.show({
          message: 'Unbekannter Fehler: Etwas ist schiefgegangen.',
          intent: 'danger',
        })
      }
      setSelfServiceState(CardSelfServiceStep.form)
      setIsLoading(false)
    },
    [appToaster, setSelfServiceState]
  )

  const generateCards = useCallback(async (): Promise<void> => {
    setIsLoading(true)

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
        return Promise.reject(new CreateCardsError(title))
      }
      if (!result.data) {
        return Promise.reject(new CreateCardsError('Beim Erstellen der Karte(n) ist ein Fehler aufgetreten.'))
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

      setIsLoading(false)
      setSelfServiceState(CardSelfServiceStep.information)
    } catch (error) {
      handleErrors(error)
    }
  }, [projectConfig, setIsLoading, setDeepLink, setCode, createCardsSelfService, handleErrors, selfServiceCards])

  const downloadPdf = async (code: CreateCardsResult, fileName: string): Promise<void> => {
    const blob = await generatePdf([code], selfServiceCards, projectConfig.pdf)
    downloadDataUri(blob, fileName)
  }

  return {
    selfServiceState,
    setSelfServiceState,
    isLoading,
    deepLink,
    code,
    selfServiceCards,
    setSelfServiceCards,
    generateCards,
    downloadPdf,
  }
}
export default useCardGeneratorSelfService
