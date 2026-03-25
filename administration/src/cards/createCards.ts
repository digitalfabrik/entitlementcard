import { fromBinary, toBinary } from '@bufbuild/protobuf'
import { UseMutationExecute } from 'urql'

import {
  CardInfoSchema,
  type DynamicActivationCode,
  DynamicActivationCodeSchema,
  type StaticVerificationCode,
  StaticVerificationCodeSchema,
} from '../card_pb'
import {
  CreateCardsFromSelfServiceMutation,
  CreateCardsFromSelfServiceMutationVariables,
  CreateCardsMutation,
  CreateCardsMutationVariables,
} from '../graphql'
import type { ProjectConfig } from '../project-configs'
import { mapGraphqlRequestResult } from '../util/helper'
import { base64ToUint8Array, uint8ArrayToBase64 } from './base64'
import { Card, generateCardInfo } from './card'

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

export type CreateCardsMutationFn = UseMutationExecute<
  CreateCardsMutation,
  CreateCardsMutationVariables
>
export type CreateCardsFromSelfServiceMutationFn = UseMutationExecute<
  CreateCardsFromSelfServiceMutation,
  CreateCardsFromSelfServiceMutationVariables
>

const mapCardCreationResult = (card: RawCreateCardsResult): CreateCardsResult => {
  const dynamicActivationCode = fromBinary(
    DynamicActivationCodeSchema,
    base64ToUint8Array(card.dynamicActivationCode.codeBase64),
  )
  const staticVerificationCode = card.staticVerificationCode
    ? fromBinary(
        StaticVerificationCodeSchema,
        base64ToUint8Array(card.staticVerificationCode.codeBase64),
      )
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
  const cardInfo = uint8ArrayToBase64(toBinary(CardInfoSchema, generateCardInfo(selfServiceCard)))
  const result = await createCardsSelfService({
    project: projectConfig.projectId,
    generateStaticCodes: true,
    encodedCardInfo: cardInfo,
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
    .map(cardInfo => uint8ArrayToBase64(toBinary(CardInfoSchema, cardInfo)))
  const result = await createCardsMutation({
    encodedCardInfos,
    generateStaticCodes,
    applicationIdToMarkAsProcessed,
  })
  const data = mapGraphqlRequestResult(result, message => new CreateCardsError(message))
  return data.cards.map(mapCardCreationResult)
}

export default createCards
