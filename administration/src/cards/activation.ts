import { DynamicActivationCode } from '../generated/card_pb'
import {
  AddCardDocument,
  AddCardMutation,
  AddCardMutationVariables,
  CardGenerationModelInput,
  Region,
} from '../generated/graphql'
import hashCardInfo from './hashCardInfo'
import uint8ArrayToBase64 from '../util/uint8ArrayToBase64'
import { ApolloClient } from '@apollo/client'

export async function activateCard(
  client: ApolloClient<object>,
  activationCode: DynamicActivationCode,
  region: Region
) {
  const cardInfoHash = await hashCardInfo(activationCode.pepper, activationCode.info!)
  const expirationDay = activationCode.info!.expirationDay
  const card: CardGenerationModelInput = {
    cardExpirationDay: expirationDay ?? null, // JS number can represent integers up to 2^53, so it can represent all values of an uint32 (protobuf)
    cardInfoHashBase64: uint8ArrayToBase64(cardInfoHash),
    totpSecretBase64: uint8ArrayToBase64(activationCode.totpSecret),
    regionId: region.id,
  }

  return await client.mutate<AddCardMutation, AddCardMutationVariables>({
    mutation: AddCardDocument,
    variables: { card },
  })
}

export async function activateCards(
  client: ApolloClient<object>,
  activationCodes: DynamicActivationCode[],
  region: Region
) {
  const results = await Promise.all(
    activationCodes.map(async activationCode => activateCard(client, activationCode, region))
  )

  const firstFailure = results.find(result => !result.data?.success)
  if (firstFailure) {
    throw Error(JSON.stringify(firstFailure))
  }
}
