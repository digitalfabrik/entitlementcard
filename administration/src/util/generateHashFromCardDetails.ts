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
    const expirationDateBytes = 8 // int64
    const cardTypeBytes = 4 // int32
    const regionIdBytes = 4 // int32
    const fullNameBytes = fullNameWithoutZero.byteLength + 1 // zero terminated string
    const binary = new Uint8Array(expirationDateBytes + cardTypeBytes + regionIdBytes + fullNameBytes)
    const binaryView = new DataView(binary.buffer)

    let offset = 0

    binary.set(cardDetails.expirationDate.toBytesLE(), offset)
    offset += expirationDateBytes

    binaryView.setInt32(offset, cardDetails.cardType, true)
    offset += cardTypeBytes

    binaryView.setInt32(offset, cardDetails.regionId, true)
    offset += regionIdBytes

    binary.set(fullNameWithoutZero, offset)
    return binary;
}

const generateHashFromCardDetails = async (hashSecret: Uint8Array, cardDetails: CardDetails) => {
    const binary = cardDetailsToBinary(cardDetails)

    // In IE11, this returns KeyOperation / CryptoOperation,
    // see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#browser_compatibility
    let hashArrayBuffer: ArrayBuffer
    if (isIE11()) {
        const key = await new Promise((resolve, reject) => { // @ts-ignore
            const op = msCrypto.subtle.importKey("raw", hashSecret, {name: "HMAC", hash: "SHA-256"}, false, ["sign"]) // @ts-ignore
            op.oncomplete = (event) => resolve(event.target.result) // @ts-ignore
            op.onerror = (e) => reject(e)
        })

        hashArrayBuffer = await new Promise((resolve, reject) => { // @ts-ignore
            const op = msCrypto.subtle.sign({name: "HMAC", hash: "SHA-256"}, key, binary.buffer) // @ts-ignore
            op.oncomplete = (event) => resolve(event.target.result) // @ts-ignore
            op.onerror = (e) => reject(e)
        })
    } else {
        const key = await crypto.subtle.importKey("raw", hashSecret, {name: 'HMAC', hash: 'SHA-256'}, false, ["sign"])
        hashArrayBuffer = await crypto.subtle.sign("HMAC", key, binary.buffer)
    }
    return new Uint8Array(hashArrayBuffer)
}

export default generateHashFromCardDetails
