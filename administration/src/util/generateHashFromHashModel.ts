import {CardActivateModel} from "../generated/compiled";
import isIE11 from "./isIE11";

export interface HashModel {
    fullName: string,
    region: number,
    randomBytes: Uint8Array,
    cardType: CardActivateModel.CardType,
}

const generateHashFromHashModel = async (hashModel: HashModel) => {
    // todo: replace this routine with e.g. a protobuf hashModel for reliable hashes
    // todo: (also don't use TextEncoder for IE11)
    const encoder = new TextEncoder()
    const binary = encoder.encode(JSON.stringify(hashModel))

    // In IE11, this returns CryptoOperation,
    // see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#browser_compatibility
    let hashArrayBuffer: ArrayBuffer
    if (isIE11()) { // This still needs to be tested
        hashArrayBuffer = await new Promise((resolve) => {
            // @ts-ignore
            window.msCrypto.subtle.digest("SHA-128", binary).oncomplete = data => resolve(data)
        })
        // @ts-ignore
    } else {
        hashArrayBuffer = await crypto.subtle.digest("SHA-512", binary)
    }

    return new Uint8Array(hashArrayBuffer)
}

export default generateHashFromHashModel
