import { CardCreationModel } from './CardCreationModel'
import { CardType } from '../../models/CardType'
import { CardActivationCode, BavariaCardType } from '../../generated/protobuf'
import generateCardActivateModel from '../../util/generateCardActivateModel'
import generateHashFromCardDetails from '../../util/generateHashFromCardDetails'
import uint8ArrayToBase64 from '../../util/uint8ArrayToBase64'
import { generatePdf, loadTTFFont } from './PdfFactory'
import { ApolloClient } from '@apollo/client'
import {
  AddCardDocument,
  AddCardMutation,
  AddCardMutationVariables,
  CardGenerationModelInput,
  Region,
} from '../../generated/graphql'

const generateCards = async (client: ApolloClient<object>, cardCreationModels: CardCreationModel[], region: Region) => {
  const activateModels = cardCreationModels.map(model => {
    const cardType = model.cardType === CardType.gold ? BavariaCardType.GOLD : BavariaCardType.STANDARD
    return generateCardActivateModel(`${model.forename} ${model.surname}`, region.id, model.expirationDate, cardType)
  })
  const cardInputs: CardGenerationModelInput[] = await Promise.all(
    activateModels.map(async model => {
      const cardDetailsHash = await generateHashFromCardDetails(model.hashSecret, model.info)
      return {
        expirationDate: model.info!.expiration?.date?.toNumber() || 0,
        cardDetailsHashBase64: uint8ArrayToBase64(cardDetailsHash),
        totpSecretBase64: uint8ArrayToBase64(model.totpSecret),
        regionId: region.id,
      }
    })
  )
  const results = await Promise.all(
    cardInputs.map(card =>
      client.mutate<AddCardMutation, AddCardMutationVariables>({ mutation: AddCardDocument, variables: { card } })
    )
  )
  const fail = results.find(result => !result.data?.success)
  if (fail) throw Error(JSON.stringify(fail))

  const font = await loadTTFFont('NotoSans', 'normal', '/pdf-fonts/NotoSans-Regular.ttf')

  return generatePdf(font, activateModels, region)
}

export default generateCards
