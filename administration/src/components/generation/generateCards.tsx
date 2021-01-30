import {CardCreationModel} from "./CardCreationModel";
import {CardType} from "../../models/CardType";
import {CardActivateModel} from "../../generated/compiled";
import generateCardActivateModel from "../../util/generateCardActivateModel";
import {CardInput} from "../../../__generated__/globalTypes";
import generateHashFromHashModel from "../../util/generateHashFromHashModel";
import uint8ArrayToBase64 from "../../util/uint8ArrayToBase64";
import {addCard, addCardVariables} from "../../graphql/verification/__generated__/addCard";
import {ADD_CARD} from "../../graphql/verification/mutations";
import {generatePdf} from "./PdfFactory";
import {ApolloClient} from "@apollo/client";

const generateCards = async (client: ApolloClient<object>, cardCreationModels: CardCreationModel[]) => {
    const region = 0; // TODO: Add correct region
    const activateModels = cardCreationModels.map(model => {
        const cardType = model.cardType === CardType.gold
            ? CardActivateModel.CardType.GOLD
            : CardActivateModel.CardType.STANDARD
        return generateCardActivateModel(
            `${model.forename} ${model.surname}`,
            region,
            model.expirationDate,
            cardType)
    })
    const cardInputs: CardInput[] = await Promise.all(
        activateModels.map(async (model) => {
            const hashModel = await generateHashFromHashModel(model)
            return {
                expirationDate: model.expirationDate,
                hashModelBase64: uint8ArrayToBase64(hashModel),
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
