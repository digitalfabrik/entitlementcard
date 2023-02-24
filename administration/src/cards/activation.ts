import {DynamicActivationCode, StaticVerificationCode} from '../generated/card_pb'
import {
  AddCardDocument,
  AddCardMutation,
  AddCardMutationVariables,
  CardGenerationModelInput,
  CodeType,
  Region,
} from '../generated/graphql'
import hashCardInfo from './hashCardInfo'
import {ApolloClient} from '@apollo/client'
import {uint8ArrayToBase64} from '../util/base64'

export async function createCard<T extends DynamicActivationCode | StaticVerificationCode>(
  client: ApolloClient<object>,
  activationCode: T,
  region: Region,
  codeType: T extends DynamicActivationCode ? CodeType.Dynamic : CodeType.Static
) {
  const cardInfoHash = await hashCardInfo(activationCode.info!, activationCode.pepper)
  const expirationDay = activationCode.info!.expirationDay
  const activationSecretBase64 =
    activationCode instanceof DynamicActivationCode ? uint8ArrayToBase64(activationCode.activationSecret) : null
  const card: CardGenerationModelInput = {
    cardExpirationDay: expirationDay ?? null, // JS number can represent integers up to 2^53, so it can represent all values of an uint32 (protobuf)
    cardInfoHashBase64: uint8ArrayToBase64(cardInfoHash),
    activationSecretBase64: activationSecretBase64,
    regionId: region.id,
    codeType,
  }

  return await client.mutate<AddCardMutation, AddCardMutationVariables>({
    mutation: AddCardDocument,
    variables: {card},
  })
}

export async function createCards<T extends DynamicActivationCode | StaticVerificationCode>(
  client: ApolloClient<object>,
  activationCodes: T[],
  region: Region,
  codeType: T extends DynamicActivationCode ? CodeType.Dynamic : CodeType.Static
) {
  const results = await Promise.all(
    activationCodes.map(async activationCode => createCard(client, activationCode, region, codeType))
  )

  const firstFailure = results.find(result => !result.data?.success)
  if (firstFailure) {
    throw Error(JSON.stringify(firstFailure))
  }
}
