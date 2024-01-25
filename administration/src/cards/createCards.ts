import { ApolloClient, ApolloError } from '@apollo/client'

import getMessageFromApolloError from '../errors/getMessageFromApolloError'
import { CardInfo, DynamicActivationCode, StaticVerificationCode } from '../generated/card_pb'
import {
  CreateCardsDocument,
  CreateCardsMutation,
  CreateCardsMutationVariables,
} from '../generated/graphql'
import { base64ToUint8Array, uint8ArrayToBase64 } from '../util/base64'

export class CreateCardsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CreateCardsError'
  }
}

type CreateCardsResult = { dynamicActivationCodes: DynamicActivationCode[], staticVerificationCodes: StaticVerificationCode[] }

async function createCards(client: ApolloClient<object>, projectId: string, cardInfos: CardInfo[], staticCodes: boolean): Promise<CreateCardsResult> {
  const cards = cardInfos.map(cardInfo => {
    const encodedCardInfoBase64 = uint8ArrayToBase64(cardInfo.toBinary())
    return { encodedCardInfoBase64, generateDynamicActivationCode: true, generateStaticVerificationCode: staticCodes }
  })
  const result = await client.mutate<CreateCardsMutation, CreateCardsMutationVariables>({
    mutation: CreateCardsDocument,
    variables: { project: projectId, cards },
  })

  if (result.errors) {
    const { title } = getMessageFromApolloError(new ApolloError({ graphQLErrors: result.errors }))
    throw new CreateCardsError(title)
  }
  if (!result.data) {
    throw new CreateCardsError('Beim erstellen der Karte(n) ist ein Fehler aufgetreten.')
  }

  return result.data.cards.reduce<CreateCardsResult>((acc, card) => {
    const dynamicActivationCode = card.dynamicActivationCodeBase64 ? [DynamicActivationCode.fromBinary(base64ToUint8Array(card.dynamicActivationCodeBase64))] : []
    const staticVerificationCode = card.staticVerificationCodeBase64 ? [StaticVerificationCode.fromBinary(base64ToUint8Array(card.staticVerificationCodeBase64))] : []
    return {
      dynamicActivationCodes: [...acc.dynamicActivationCodes, ...dynamicActivationCode],
      staticVerificationCodes: [...acc.staticVerificationCodes, ...staticVerificationCode]
    }
  }, { dynamicActivationCodes: [], staticVerificationCodes: [] })
}

export default createCards
