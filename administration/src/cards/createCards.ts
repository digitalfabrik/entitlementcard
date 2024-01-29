import { ApolloClient, ApolloError } from '@apollo/client'

import getMessageFromApolloError from '../errors/getMessageFromApolloError'
import { CardInfo, DynamicActivationCode, StaticVerificationCode } from '../generated/card_pb'
import { CreateCardsDocument, CreateCardsMutation, CreateCardsMutationVariables } from '../generated/graphql'
import { base64ToUint8Array, uint8ArrayToBase64 } from '../util/base64'

export class CreateCardsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CreateCardsError'
  }
}

export type CreateCardsResult = {
  dynamicCardInfoHashBase64: string
  dynamicActivationCode: DynamicActivationCode
  staticVerificationCode?: StaticVerificationCode
}

async function createCards(
  client: ApolloClient<object>,
  projectId: string,
  cardInfos: CardInfo[],
  generateStaticCodes: boolean
): Promise<CreateCardsResult[]> {
  const encodedCardInfos = cardInfos.map(cardInfo => uint8ArrayToBase64(cardInfo.toBinary()))
  const result = await client.mutate<CreateCardsMutation, CreateCardsMutationVariables>({
    mutation: CreateCardsDocument,
    variables: { project: projectId, encodedCardInfos, generateStaticCodes },
  })

  if (result.errors) {
    const { title } = getMessageFromApolloError(new ApolloError({ graphQLErrors: result.errors }))
    throw new CreateCardsError(title)
  }
  if (!result.data) {
    throw new CreateCardsError('Beim erstellen der Karte(n) ist ein Fehler aufgetreten.')
  }

  return result.data.cards.map(card => {
    const dynamicActivationCode = DynamicActivationCode.fromBinary(
      base64ToUint8Array(card.dynamicActivationCode.codeBase64)
    )
    const staticVerificationCode = card.staticVerificationCodeBase64
      ? StaticVerificationCode.fromBinary(base64ToUint8Array(card.staticVerificationCodeBase64))
      : undefined
    return {
      dynamicActivationCode,
      staticVerificationCode,
      dynamicCardInfoHashBase64: card.dynamicActivationCode?.cardInfoHashBase64,
    }
  })
}

export default createCards
