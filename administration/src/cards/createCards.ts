import { TFunction } from 'i18next'

import { DynamicActivationCode, StaticVerificationCode } from '../generated/card_pb'
import { CreateCardsFromSelfServiceMutationFn, CreateCardsMutation, CreateCardsMutationFn } from '../generated/graphql'
import { ProjectConfig } from '../project-configs/getProjectConfig'
import { base64ToUint8Array, uint8ArrayToBase64 } from '../util/base64'
import { mapGraphqlRequestResult } from '../util/helper'
import { Card, generateCardInfo } from './Card'

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
    base64ToUint8Array(card.dynamicActivationCode.codeBase64)
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
  t: TFunction
): Promise<CreateCardsResult> => {
  const cardInfo = uint8ArrayToBase64(generateCardInfo(selfServiceCard).toBinary())
  const result = await createCardsSelfService({
    variables: { project: projectConfig.projectId, generateStaticCodes: true, encodedCardInfo: cardInfo },
  })
  const data = mapGraphqlRequestResult(result, message => new CreateCardsError(message), t)
  return mapCardCreationResult(data.card)
}

const createCards = async (
  createCardsService: CreateCardsMutationFn,
  projectConfig: ProjectConfig,
  cards: Card[],
  t: TFunction,
  applicationIdToMarkAsProcessed?: number
): Promise<CreateCardsResult[]> => {
  const { projectId, staticQrCodesEnabled: generateStaticCodes } = projectConfig
  const encodedCardInfos = cards.map(generateCardInfo).map(cardInfo => uint8ArrayToBase64(cardInfo.toBinary()))
  const result = await createCardsService({
    variables: { project: projectId, encodedCardInfos, generateStaticCodes, applicationIdToMarkAsProcessed },
  })
  const data = mapGraphqlRequestResult(result, message => new CreateCardsError(message), t)
  return data.cards.map(mapCardCreationResult)
}

export default createCards
