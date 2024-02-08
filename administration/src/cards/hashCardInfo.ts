import { AnyMessage, Message } from '@bufbuild/protobuf'

import { CardInfo } from '../generated/card_pb'
import serializeToCanonicalJson from '../util/serializeToCanonicalJson'

function messageHasUnknownFields(message: AnyMessage): boolean {
  return message.getType().runtime.bin.listUnknownFields(message).length > 0
}

/**
 * Returns a canonical JSON object from the given protobuf message.
 * It asserts that
 * 1. the message does not have any unknown fields,
 * 2. every field in the message (and submessages, recursively) is marked as optional and thus has explicit presence,
 * 3. there are only singular enums, integers and submessages as fields (no maps or repeated fields).
 * For every present field in the message, we add an entry to the resulting object where the key is the tagNumber of the
 * field, and the value is the appropriately encoded JSON value.
 * Note, that we encode integers as strings because JSON-Number does not allow the full range of uint64 integers.
 */
export function messageToJsonObject(message: AnyMessage): { [key in string]: any } {
  if (messageHasUnknownFields(message)) {
    throw Error('Message has unknown fields. You might be running on an outdated proto definition.')
  }

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
      // If we want to support repeated fields in the future, we should probably do the following to avoid breaking
      // older protos without the field:
      // If the repeated field is empty (if there are no elements "in the array"), do not emit anything in the JSON.
      // If there is at least one field, emit a JSON Array by mapping each element to its JSON equivalent (see below).
      throw Error('Repeated fields are currently not supported.')
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
        if (value === undefined) {
          // The field is not present.
          continue
        }
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
  const canonicalJsonString = serializeToCanonicalJson(object)
  // canonicalJsonString is a (UTF-16) JS string that (except for the encoding) follows RFC 8785.
  return new TextEncoder().encode(canonicalJsonString)
}

export const PEPPER_LENGTH = 16 // 128 bit randomness

/**
 * Hashes the card info using a pepper.
 * The card info is first mapped into a JSON object using `messageToJsonObject`.
 * This JSON object is converted to an RFC 8785 compliant JSON string and encoded in UTF-8.
 */
async function hashCardInfo(cardInfo: CardInfo, pepper: Uint8Array): Promise<Uint8Array> {
  if (pepper.length !== PEPPER_LENGTH) {
    throw Error(`The pepper has an invalid length of ${pepper.length}.`)
  }
  const binary = cardInfoToBinary(cardInfo)

  const key = await crypto.subtle.importKey('raw', pepper, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const hashArrayBuffer: ArrayBuffer = await crypto.subtle.sign('HMAC', key, binary.buffer)

  return new Uint8Array(hashArrayBuffer)
}

export default hashCardInfo
