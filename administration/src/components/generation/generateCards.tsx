import {CardCreationModel} from "./CardCreationModel";
import {CardType} from "../../models/CardType";
import {CardActivateModel} from "../../generated/compiled";
import generateCardActivateModel from "../../util/generateCardActivateModel";
import {CardGenerationModelInput} from "../../../__generated__/globalTypes";
import generateHashFromCardDetails from "../../util/generateHashFromCardDetails";
import uint8ArrayToBase64 from "../../util/uint8ArrayToBase64";
import {addCard, addCardVariables} from "../../graphql/verification/__generated__/addCard";
import {ADD_CARD} from "../../graphql/verification/mutations";
import {generatePdf} from "./PdfFactory";
import {ApolloClient} from "@apollo/client";

const generateCards = async (client: ApolloClient<object>, cardCreationModels: CardCreationModel[]) => {
    const regionId = 0; // TODO: Add correct regionId
    const activateModels = cardCreationModels.map(model => {
        const cardType = model.cardType === CardType.gold
            ? CardActivateModel.CardType.GOLD
            : CardActivateModel.CardType.STANDARD
        return generateCardActivateModel(
            `${model.forename} ${model.surname}`,
            regionId,
            model.expirationDate,
            cardType)
    })
    const cardInputs: CardGenerationModelInput[] = await Promise.all(
        activateModels.map(async (model) => {
            const cardDetailsHash = await generateHashFromCardDetails(model.hashSecret, model)
            return {
                expirationDate: model.expirationDate.toNumber(),
                cardDetailsHashBase64: uint8ArrayToBase64(cardDetailsHash),
                totpSecretBase64: uint8ArrayToBase64(model.totpSecret)
            }
        }))
    const results = await Promise.all(
        cardInputs.map(card =>
            client.mutate<addCard, addCardVariables>({mutation: ADD_CARD, variables: {card}}))
    )
    const fail = results.find(result => result.errors || !result.data?.success)
    if (fail) throw Error(JSON.stringify(fail))

    return generatePdf(cardCreationModels)
}

export default generateCards
