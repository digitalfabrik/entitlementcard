import { DynamicActivationCode, StaticVerificationCode } from '../generated/card_pb'
import {
  CreateCardsFromSelfServiceMutationFn,
  CreateCardsMutation,
  CreateCardsMutationFn,
} from '../generated/graphql'
import type { ProjectConfig } from '../project-configs/getProjectConfig'
import { mapGraphqlRequestResult } from '../util/helper'
import { Card, generateCardInfo } from './Card'
import { base64ToUint8Array, uint8ArrayToBase64 } from './base64'

export class CreateCardsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CreateCardsError'
  }
}

type RawCreateCardsResult = CreateCardsMutation['cards'][number]

export type CreateCardsResult = {
  dynamicCardInfoHashBase64: string
  dynamicActivationCode: DynamicActivationCode
  staticCardInfoHashBase64?: string
  staticVerificationCode?: StaticVerificationCode
}

const mapCardCreationResult = (card: RawCreateCardsResult): CreateCardsResult => {
  const dynamicActivationCode = DynamicActivationCode.fromBinary(
    base64ToUint8Array(card.dynamicActivationCode.codeBase64),
  )
  const staticVerificationCode = card.staticVerificationCode
    ? StaticVerificationCode.fromBinary(base64ToUint8Array(card.staticVerificationCode.codeBase64))
    : undefined
  return {
    dynamicActivationCode,
    staticVerificationCode,
    staticCardInfoHashBase64: card.staticVerificationCode?.cardInfoHashBase64,
    dynamicCardInfoHashBase64: card.dynamicActivationCode.cardInfoHashBase64,
  }
}

export const createSelfServiceCard = async (
  createCardsSelfService: CreateCardsFromSelfServiceMutationFn,
  projectConfig: ProjectConfig,
  selfServiceCard: Card,
): Promise<CreateCardsResult> => {
  const cardInfo = uint8ArrayToBase64(generateCardInfo(selfServiceCard).toBinary())
  const result = await createCardsSelfService({
    variables: {
      project: projectConfig.projectId,
      generateStaticCodes: true,
      encodedCardInfo: cardInfo,
    },
  })
  const data = mapGraphqlRequestResult(result, message => new CreateCardsError(message))
  return mapCardCreationResult(data.card)
}

const createCards = async (
  createCardsMutation: CreateCardsMutationFn,
  projectConfig: ProjectConfig,
  cards: Card[],
  applicationIdToMarkAsProcessed: number | null,
): Promise<CreateCardsResult[]> => {
  const { staticQrCodesEnabled: generateStaticCodes } = projectConfig
  const encodedCardInfos = cards
    .map(generateCardInfo)
    .map(cardInfo => uint8ArrayToBase64(cardInfo.toBinary()))
  const result = await createCardsMutation({
    variables: { encodedCardInfos, generateStaticCodes, applicationIdToMarkAsProcessed },
  })
  const data = mapGraphqlRequestResult(result, message => new CreateCardsError(message))
  return data.cards.map(mapCardCreationResult)
}

export default createCards
