import { AnyMessage, Message } from '@bufbuild/protobuf'
import { CardInfo } from '../generated/card_pb'
import canonicalize from 'canonicalize'

export const messageToJsonObject = (message: AnyMessage): { [key in string]: any } => {
  const result: { [key in string]: any } = {}
  for (const field of message.getType().fields.byNumber()) {
    if (!field.opt) {
      throw Error(
        `Field ${field.localName} is not optional, although we only allow optional fields. \n` +
          "Note that, 'optional' in proto3 only means explicit presence, i.e. it can be determined if a field marked " +
          'as optional is actually present in an instance of a proto. Using only fields with explicit presence ' +
          'enables us to remove fields from the proto in the future.'
      )
    }
    if (field.repeated) {
      throw Error('Repeated fields are currently not supported.')
    }
    if (field.kind === 'map') {
    }
    switch (field.kind) {
      case 'map':
        throw Error('Fields of type map are currently not supported.')
      case 'message': {
        const subMessage = message[field.localName]
        if (subMessage === undefined) continue
        if (!(subMessage instanceof Message)) {
          throw Error(`Field ${field.localName} is not an instance of Message despite its kind is 'message'.`)
        }
        result[field.no.toString()] = messageToJsonObject(subMessage)
        break
      }
      case 'enum':
      case 'scalar': {
        const value = message[field.localName]
        if (value === undefined) continue
        if (typeof value === 'string') {
          result[field.no.toString()] = value
        } else if (typeof value === 'number') {
          if (!Number.isSafeInteger(value)) {
            throw Error(`Field ${field.localName} is not a safe integer.`)
          }
          result[field.no.toString()] = value.toString()
        } else {
          throw Error(`Field ${field.localName} has an unsupported value of ${value}.`)
        }
        break
      }
      default:
        throw Error('Field has an unsupported kind.')
    }
  }
  return result
}

const cardInfoToBinary = (cardInfo: CardInfo) => {
  const object = messageToJsonObject(cardInfo)
  const canonicalJsonString = canonicalize(object)
  // canonicalJsonString is a (UTF-16) JS string that (except for the encoding) follows RFC 8785.
  return new TextEncoder().encode(canonicalJsonString)
}

export const PEPPER_LENGTH = 16 // 128 bit randomness

const hashCardInfo = async (pepper: Uint8Array, cardInfo: CardInfo) => {
  if (pepper.length !== PEPPER_LENGTH) {
    throw Error(`The pepper has an invalid length of ${pepper.length}.`)
  }
  const binary = cardInfoToBinary(cardInfo)

  const key = await crypto.subtle.importKey('raw', pepper, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const hashArrayBuffer: ArrayBuffer = await crypto.subtle.sign('HMAC', key, binary.buffer)

  return new Uint8Array(hashArrayBuffer)
}

export default hashCardInfo
