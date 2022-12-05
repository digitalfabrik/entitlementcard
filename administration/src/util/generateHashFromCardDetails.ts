import isIE11 from './isIE11'
import {CardInfo} from "../generated/card_pb";

export function bigIntToNumber64bit (a: bigint): ArrayBuffer {
  const buffer = new ArrayBuffer(8);
  const dataView = new DataView(buffer);
  dataView.setBigInt64(0, a);
  return buffer;
}

const cardInfoToBinary = (cardInfo: CardInfo) => {
  const fullNameWithoutZero = new TextEncoder().encode(cardInfo.fullName)
  const expirationDateBytes = 8 // int64
  const cardTypeBytes = 4 // int32
  const regionIdBytes = 4 // int32
  const fullNameBytes = fullNameWithoutZero.byteLength + 1 // zero terminated string
  const binary = new Uint8Array(expirationDateBytes + cardTypeBytes + regionIdBytes + fullNameBytes)
  const binaryView = new DataView(binary.buffer)

  let offset = 0

  binary.set(new Uint8Array(bigIntToNumber64bit(cardInfo.expiration!.date!)), offset)
  offset += expirationDateBytes

  binaryView.setInt32(offset, cardInfo.extensions?.extensionBavariaCardType?.cardType!, true)
  offset += cardTypeBytes

  binaryView.setInt32(offset, cardInfo.extensions?.extensionRegion!.regionId!, true)
  offset += regionIdBytes
  
  // FIXME: Include all the other extensions

  binary.set(fullNameWithoutZero, offset)
  return binary
}

const generateHashFromCardDetails = async (hashSecret: Uint8Array, cardInfo: CardInfo) => {
  const binary = cardInfoToBinary(cardInfo)

  // In IE11, this returns KeyOperation / CryptoOperation,
  // see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#browser_compatibility
  let hashArrayBuffer: ArrayBuffer
  if (isIE11()) {
    throw Error("IE11 is not supported")
  } else {
    const key = await crypto.subtle.importKey('raw', hashSecret, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    hashArrayBuffer = await crypto.subtle.sign('HMAC', key, binary.buffer)
  }
  return new Uint8Array(hashArrayBuffer)
}

export default generateHashFromCardDetails
