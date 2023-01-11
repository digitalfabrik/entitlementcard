import { add } from 'date-fns'
import {
  BavariaCardType as GraphQLBavariaCardType,
  BavariaCardTypeExtension,
  CardExtensions,
  CardInfo,
  DynamicActivationCode,
  RegionExtension,
} from '../generated/card_pb'
import { dateToDaysSinceEpoch } from './validityPeriod'
import { Region } from '../generated/graphql'
import { bavaria_card_type, Extension, ExtensionHolder, region_extension, RegionState } from './extensions'

const MAX_NAME_LENGTH = 60 // TODO: Select proper max value
const TOTP_SECRET_LENGTH = 20
const PEPPER_LENGTH = 16

/**
 * Blueprint for a new card. This object contains data about a future card, which will be created.
 */
export class CardBlueprint {
  fullName: string
  expirationDate: Date | null
  extension_states: ExtensionHolder<any>[]

  constructor(fullName: string, expirationDate: Date | null, extension_states: ExtensionHolder<any>[]) {
    this.fullName = fullName
    this.expirationDate = expirationDate
    this.extension_states = extension_states
  }

  hasInfiniteLifetime(): boolean {
    return !!this.extension_states.find(state => state.extension.causesInfiniteLifetime(state))
  }

  isValid(): boolean {
    return (
      (isNameValid(this.fullName) &&
        this.expirationDate !== null &&
        !this.hasInfiniteLifetime() &&
        isExpirationDateValid(this.expirationDate)) ||
      (this.expirationDate === null && this.hasInfiniteLifetime())
    )
  }

  generateActivationCode = (): DynamicActivationCode => {
    if (!window.isSecureContext) {
      // localhost is considered secure.
      throw Error('Environment is not considered secure nor are we using Internet Explorer.')
    }
    const pepper = new Uint8Array(PEPPER_LENGTH) // 128 bit randomness
    crypto.getRandomValues(pepper)

    // https://tools.ietf.org/html/rfc6238#section-3 - R3 (TOTP uses HTOP)
    // https://tools.ietf.org/html/rfc4226#section-4 - R6 (How long should a shared secret be? -> 160bit)
    // https://tools.ietf.org/html/rfc4226#section-7.5 - Random Generation (How to generate a secret? -> Random)
    const totpSecret = new Uint8Array(TOTP_SECRET_LENGTH)
    crypto.getRandomValues(totpSecret)

    const expirationDate = this.expirationDate

    let extension_message = {}

    for (const state of this.extension_states) {
      state.extension.setProtobufData(state, extension_message)
    }

    return new DynamicActivationCode({
      info: new CardInfo({
        fullName: this.fullName,
        expirationDay: expirationDate !== null ? dateToDaysSinceEpoch(expirationDate) : undefined,
        extensions: new CardExtensions(extension_message),
      }),
      pepper: pepper,
      totpSecret: totpSecret,
    })
  }
}

export const isNameValid = (value: string) => value.length > 0 && value.length < MAX_NAME_LENGTH

export const isExpirationDateValid = (value: Date | null) => value !== null && value > new Date()

export const createEmptyCard = (region: Region): CardBlueprint =>
  new CardBlueprint('', add(Date.now(), { years: 2 }), [
    {
      state: bavaria_card_type.initialState,
      extension: bavaria_card_type,
    },
    {
      state: {
        region_id: region.id,
      },
      extension: region_extension,
    },
  ])
