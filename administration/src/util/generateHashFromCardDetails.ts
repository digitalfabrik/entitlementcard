import {CardActivateModel} from "../generated/compiled";
import isIE11 from "./isIE11";

export interface CardDetails {
    fullName: string,
    regionId: number,
    expirationDate: Long,
    cardType: CardActivateModel.CardType,
}

const cardDetailsToBinary = (cardDetails: CardDetails) => {
    const fullNameWithoutZero = new TextEncoder().encode(cardDetails.fullName)
    const binary = new Uint8Array(
        8 // int64 expirationDate
        +4 // int32 cardType
        +4 // int32 regionId
        +fullNameWithoutZero.byteLength+1 // zeroPadded fullName
    )
    const binaryView = new DataView(binary.buffer)
    binary.set(cardDetails.expirationDate.toBytesLE(), 0)
    binaryView.setInt32(8, cardDetails.cardType, true)
    binaryView.setInt32(12, cardDetails.regionId, true)
    binary.set(fullNameWithoutZero, 16)
    return binary;
}

const generateHashFromCardDetails = async (hashSecret: Uint8Array, cardDetails: CardDetails) => {
    const binary = cardDetailsToBinary(cardDetails)

    // In IE11, this returns CryptoOperation,
    // see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#browser_compatibility
    let hashArrayBuffer: ArrayBuffer
    if (isIE11()) { // @ts-ignore
        hashArrayBuffer = await new Promise((resolve, reject) => { // @ts-ignore
            const operation = window.msCrypto.subtle.digest({ name: "SHA-256", hash: "SHA-256" }, binary.buffer) // @ts-ignore
            operation.oncomplete = (event) => resolve(event.target.result) // @ts-ignore
            operation.onerror = (e) => reject(e)
        })
    } else {
        hashArrayBuffer = await crypto.subtle.digest("SHA-256", binary)
    }
    return new Uint8Array(hashArrayBuffer)
}

export default generateHashFromCardDetails
