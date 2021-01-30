import {CardActivateModel} from "../generated/compiled";

export type HashModel = {
    fullName: string,
    region: number
    cardType: CardActivateModel.CardType
}

const generateHashFromHashModel = (hashModel: HashModel) => {
    // todo: replace this routine with e.g. a protobuf hashModel for reliable hashes
    const encoder = new TextEncoder()
    return encoder.encode(JSON.stringify(hashModel))
}

export default generateHashFromHashModel
