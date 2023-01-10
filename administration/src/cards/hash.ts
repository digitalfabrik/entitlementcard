import {CardInfo} from "../generated/card_pb";

const cardInfoToBinary = (cardInfo: CardInfo) => {
    const fullNameWithoutZero = new TextEncoder().encode(cardInfo.fullName)
    const expirationDayBytes = 4 // uint32
    const cardTypeBytes = 4 // int32
    const regionIdBytes = 4 // int32
    const fullNameBytes = fullNameWithoutZero.byteLength + 1 // zero terminated string
    const binary = new Uint8Array(expirationDayBytes + cardTypeBytes + regionIdBytes + fullNameBytes)
    const view = new DataView(binary.buffer)

    let offset = 0
    // A expirationDay of 0 indicates that the card does not expire
    view.setUint32(offset, cardInfo.expirationDay ?? 0, true)
    offset += expirationDayBytes

    view.setInt32(offset, cardInfo.extensions?.extensionBavariaCardType?.cardType!, true)
    offset += cardTypeBytes

    view.setInt32(offset, cardInfo.extensions?.extensionRegion!.regionId!, true)
    offset += regionIdBytes

    // FIXME: Include all the other extensions

    binary.set(fullNameWithoutZero, offset)
    return binary
}

const hashCardInfo = async (pepper: Uint8Array, cardInfo: CardInfo) => {
    const binary = cardInfoToBinary(cardInfo)

    const key = await crypto.subtle.importKey('raw', pepper, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    const hashArrayBuffer: ArrayBuffer = await crypto.subtle.sign('HMAC', key, binary.buffer)

    return new Uint8Array(hashArrayBuffer)
}

export default hashCardInfo
