import { DynamicActivationCode, StaticVerificationCode } from '../generated/card_pb'
import {
  AddCardDocument,
  AddCardMutation,
  AddCardMutationVariables,
  CardGenerationModelInput,
  CodeType,
  Region,
} from '../generated/graphql'
import hashCardInfo from './hash'
import uint8ArrayToBase64 from '../util/uint8ArrayToBase64'
import { ApolloClient } from '@apollo/client'

export async function activateCard<T extends DynamicActivationCode | StaticVerificationCode>(
  client: ApolloClient<object>,
  activationCode: T,
  region: Region,
  codeType: T extends DynamicActivationCode ? CodeType.Dynamic : CodeType.Static
) {
  const cardInfoHash = await hashCardInfo(activationCode.pepper, activationCode.info!)
  const expirationDay = activationCode.info!.expirationDay
  const totpSecret =
    activationCode instanceof DynamicActivationCode ? uint8ArrayToBase64(activationCode.totpSecret) : null
  const card: CardGenerationModelInput = {
    cardExpirationDay: expirationDay ?? null, // JS number can represent integers up to 2^53, so it can represent all values of an uint32 (protobuf)
    cardInfoHashBase64: uint8ArrayToBase64(cardInfoHash),
    totpSecretBase64: totpSecret,
    regionId: region.id,
    codeType,
  }

  return await client.mutate<AddCardMutation, AddCardMutationVariables>({
    mutation: AddCardDocument,
    variables: { card },
  })
}

export async function activateCards<T extends DynamicActivationCode | StaticVerificationCode>(
  client: ApolloClient<object>,
  activationCodes: T[],
  region: Region,
  codeType: T extends DynamicActivationCode ? CodeType.Dynamic : CodeType.Static
) {
  const results = await Promise.all(
    activationCodes.map(async activationCode => activateCard(client, activationCode, region, codeType))
  )

  const firstFailure = results.find(result => !result.data?.success)
  if (firstFailure) {
    throw Error(JSON.stringify(firstFailure))
  }
}
