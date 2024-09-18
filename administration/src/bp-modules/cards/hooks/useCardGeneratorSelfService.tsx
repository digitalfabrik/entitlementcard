import { useCallback, useContext, useState } from 'react'

import CardBlueprint from '../../../cards/CardBlueprint'
import { generatePdf } from '../../../cards/PdfFactory'
import { CreateCardsError, CreateCardsResult } from '../../../cards/createCards'
import getMessageFromApolloError from '../../../errors/getMessageFromApolloError'
import { DynamicActivationCode, StaticVerificationCode } from '../../../generated/card_pb'
import { Region, useCreateCardsFromSelfServiceMutation } from '../../../generated/graphql'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import { ProjectConfig } from '../../../project-configs/getProjectConfig'
import { base64ToUint8Array, uint8ArrayToBase64 } from '../../../util/base64'
import downloadDataUri from '../../../util/downloadDataUri'
import getCustomDeepLinkFromQrCode from '../../../util/getCustomDeepLinkFromQrCode'
import { useAppToaster } from '../../AppToaster'
import { getHeaders } from '../ImportCardsController'
import { CardActivationState } from './useCardGenerator'

const initializeCardBlueprintForProject = (projectConfig: ProjectConfig): CardBlueprint => {
  const headers = getHeaders(projectConfig)
  const cardBlueprint = new CardBlueprint('', projectConfig.card)
  headers.forEach(header => {
    cardBlueprint.setValue(header, '')
  })
  return cardBlueprint
}

const useCardGeneratorSelfService = () => {
  const projectConfig = useContext(ProjectConfigContext)
  const appToaster = useAppToaster()
  const [cardBlueprint, setCardBlueprint] = useState<CardBlueprint[]>([
    initializeCardBlueprintForProject(projectConfig),
  ])
  const [state, setState] = useState(CardActivationState.input)
  const [deepLink, setDeepLink] = useState<string>('')
  const [code, setCode] = useState<CreateCardsResult | null>(null)
  const [region, setRegion] = useState<Region | null>(null)
  const [createCardsSelfService] = useCreateCardsFromSelfServiceMutation({
    onCompleted: () => {
      appToaster?.show({ intent: 'success', message: 'Ihr Pass wurde erfolgreich erstellt.' })
    },
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'success', message: title })
    },
  })

  const getDeepLink = (code: CreateCardsResult): string => {
    return getCustomDeepLinkFromQrCode({
      case: 'dynamicActivationCode',
      value: code.dynamicActivationCode,
    })
  }

  const generateCards = useCallback(async () => {
    setState(CardActivationState.loading)

    try {
      const cardInfo = cardBlueprint[0].generateCardInfo()
      const result = await createCardsSelfService({
        variables: {
          project: projectConfig.projectId,
          generateStaticCodes: true,
          encodedCardInfo: uint8ArrayToBase64(cardInfo.toBinary()),
        },
      })

      if (!result.data) {
        throw new CreateCardsError('Beim erstellen der Karte(n) ist ein Fehler aufgetreten.')
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
      setRegion(result.data.card.region)
      if (code) {
        setDeepLink(getDeepLink(code))
      }

      setState(CardActivationState.finished)
    } catch (error) {
      console.log(error)
    } finally {
      // whatever
    }
  }, [cardBlueprint, projectConfig])

  const downloadPdf = async (code: CreateCardsResult, region: Region) => {
    const blob = await generatePdf([code], cardBlueprint, region, projectConfig.pdf)
    downloadDataUri(blob, 'test.pdf')
  }

  return {
    state,
    setState,
    deepLink,
    code,
    cardBlueprint,
    setCardBlueprint,
    generateCards,
    downloadPdf,
    region,
  }
}
export default useCardGeneratorSelfService
