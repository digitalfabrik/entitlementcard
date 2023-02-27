import { DynamicActivationCode, StaticVerificationCode } from '../generated/card_pb'
import {
  AddCardsDocument,
  AddCardsMutation,
  AddCardsMutationVariables,
  CardGenerationModelInput,
  CodeType,
  Region,
} from '../generated/graphql'
import hashCardInfo from './hashCardInfo'
import { ApolloClient } from '@apollo/client'
import { uint8ArrayToBase64 } from '../util/base64'

type Codes = (DynamicActivationCode | StaticVerificationCode)[]

export async function createCards(client: ApolloClient<object>, activationCodes: Codes, region: Region) {
  const cards: CardGenerationModelInput[] = await Promise.all(
    activationCodes.map(async code => {
      const codeType = code instanceof DynamicActivationCode ? CodeType.Dynamic : CodeType.Static
      const cardInfoHash = await hashCardInfo(code.info!, code.pepper)
      const expirationDay = code.info!.expirationDay
      const activationSecretBase64 =
        code instanceof DynamicActivationCode ? uint8ArrayToBase64(code.activationSecret) : null
      return {
        cardExpirationDay: expirationDay ?? null, // JS number can represent integers up to 2^53, so it can represent all values of an uint32 (protobuf)
        cardInfoHashBase64: uint8ArrayToBase64(cardInfoHash),
        activationSecretBase64: activationSecretBase64,
        regionId: region.id,
        codeType,
      }
    })
  )
  const result = await client.mutate<AddCardsMutation, AddCardsMutationVariables>({
    mutation: AddCardsDocument,
    variables: { cards },
  })
  if (!result.data?.success) {
    throw Error(JSON.stringify(result))
  }
}
