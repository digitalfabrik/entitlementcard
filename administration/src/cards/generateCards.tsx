import { CardBlueprint } from './CardBlueprint'
import { BavariaCardType } from './BavariaCardType'
import generateActivationCodes from './generateActivationCodes'
import generateHashFromCardDetails from './generateHashFromCardDetails'
import uint8ArrayToBase64 from '../util/uint8ArrayToBase64'
import { generatePdf, loadTTFFont } from './PdfFactory'
import { ApolloClient } from '@apollo/client'
import {
  AddCardDocument,
  AddCardMutation,
  AddCardMutationVariables,
  CardGenerationModelInput,
  Region,
} from '../generated/graphql'
import { BavariaCardType as GraphQLBavariaCardType } from '../generated/card_pb'

const generateCards = async (client: ApolloClient<object>, cardBlueprints: CardBlueprint[], region: Region) => {
  const activationCodes = cardBlueprints.map(cardBlueprint => {
    const cardType = cardBlueprint.cardType === BavariaCardType.gold ? GraphQLBavariaCardType.GOLD : GraphQLBavariaCardType.STANDARD
    return generateActivationCodes(
      `${cardBlueprint.forename} ${cardBlueprint.surname}`,
      region.id,
      cardBlueprint.expirationDate,
      cardType
    )
  })

  const graphQLModel: CardGenerationModelInput[] = await Promise.all(
    activationCodes.map(async activationCode => {
      const cardDetailsHash = await generateHashFromCardDetails(activationCode.pepper, activationCode.info!)
      const expirationDay = activationCode.info!.expirationDay
      return {
        cardExpirationDay: expirationDay ?? null, // JS number can represent integers up to 2^53, so it can represent all values of an uint32 (protobuf)
        cardDetailsHashBase64: uint8ArrayToBase64(cardDetailsHash),
        totpSecretBase64: uint8ArrayToBase64(activationCode.totpSecret),
        regionId: region.id,
      }
    })
  )
  const results = await Promise.all(
    graphQLModel.map(cardGenerationInput =>
      client.mutate<AddCardMutation, AddCardMutationVariables>({
        mutation: AddCardDocument,
        variables: { card: cardGenerationInput },
      })
    )
  )
  const fail = results.find(result => !result.data?.success)
  if (fail) throw Error(JSON.stringify(fail))

  const font = await loadTTFFont('NotoSans', 'normal', '/pdf-fonts/NotoSans-Regular.ttf')

  return generatePdf(font, activationCodes, region)
}

export default generateCards
