import {CardCreationModel} from "./CardCreationModel";
import {CardType} from "../../models/CardType";
import {CardActivateModel} from "../../generated/compiled";
import generateCardActivateModel from "../../util/generateCardActivateModel";
import {CardGenerationModelInput} from "../../../__generated__/globalTypes";
import generateHashFromCardDetails from "../../util/generateHashFromCardDetails";
import uint8ArrayToBase64 from "../../util/uint8ArrayToBase64";
import {addCard, addCardVariables} from "../../graphql/verification/__generated__/addCard";
import {ADD_CARD} from "../../graphql/verification/mutations";
import {generatePdf, loadTTFFont} from "./PdfFactory";
import {ApolloClient} from "@apollo/client";
import {getRegions_regions as Region} from "../../graphql/regions/__generated__/getRegions";

const generateCards = async (client: ApolloClient<object>, cardCreationModels: CardCreationModel[], region: Region) => {
    const activateModels = cardCreationModels.map(model => {
        const cardType = model.cardType === CardType.gold
            ? CardActivateModel.CardType.GOLD
            : CardActivateModel.CardType.STANDARD
        return generateCardActivateModel(
            `${model.forename} ${model.surname}`,
            region.id,
            model.expirationDate,
            cardType)
    })
    const cardInputs: CardGenerationModelInput[] = await Promise.all(
        activateModels.map(async (model) => {
            const cardDetailsHash = await generateHashFromCardDetails(model.hashSecret, model)
            return {
                expirationDate: model.expirationDate.toNumber(),
                cardDetailsHashBase64: uint8ArrayToBase64(cardDetailsHash),
                totpSecretBase64: uint8ArrayToBase64(model.totpSecret),
                regionId: region.id
            }
        }))
    const results = await Promise.all(
        cardInputs.map(card =>
            client.mutate<addCard, addCardVariables>({mutation: ADD_CARD, variables: {card}}))
    )
    const fail = results.find(result => result.errors || !result.data?.success)
    if (fail) throw Error(JSON.stringify(fail))

    const font = await loadTTFFont("NotoSans", "normal", "/pdf-fonts/NotoSans-Regular.ttf");

    return generatePdf(font, activateModels, region)
}

export default generateCards
