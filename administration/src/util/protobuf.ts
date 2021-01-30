import {CardActivateModel} from "../generated/compiled";
import generateCardActivateModel from "./generateCardActivateModel";
import uint8ArrayToBase64 from "./uint8ArrayToBase64";

export const createBinaryData = (
    fullName: string, region: number, expirationDate: Date, cardType: CardActivateModel.CardType
) => {
    const model = generateCardActivateModel(fullName, region, expirationDate, cardType);
    const buffer = CardActivateModel.encode(model).finish();
    return uint8ArrayToBase64(buffer)
}
