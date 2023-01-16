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
import {
  bavaria_card_type,
  birthday_extension,
  Extension,
  ExtensionHolder,
  nuernberg_pass_number_extension,
  region_extension,
  RegionState,
} from './extensions'

const MAX_NAME_LENGTH = 60 // TODO: Select proper max value
const TOTP_SECRET_LENGTH = 20
const PEPPER_LENGTH = 16

/**
 * Blueprint for a new card. This object contains data about a future card, which will be created.
 */
export class CardBlueprint {
  fullName: string
  expirationDate: Date | null
  extensionHolders: ExtensionHolder<any>[]

  constructor(fullName: string, expirationDate: Date | null, extension_states: ExtensionHolder<any>[]) {
    this.fullName = fullName
    this.expirationDate = expirationDate
    this.extensionHolders = extension_states
  }

  hasInfiniteLifetime(): boolean {
    return !!this.extensionHolders.find(state => state.extension.causesInfiniteLifetime(state.state))
  }

  isNameValid(): boolean {
    return this.fullName.length > 0 && this.fullName.length < MAX_NAME_LENGTH
  }

  isExpirationDateValid(): boolean {
    return this.expirationDate !== null && this.expirationDate > new Date()
  }

  isValid(): boolean {
    return (
      // Name valid
      this.isNameValid() &&
      // Extensions valid
      this.extensionHolders.every(state => state.extension.isValid(state.state)) &&
      // Expiration date valid
      ((!this.hasInfiniteLifetime() && this.isExpirationDateValid()) || this.hasInfiniteLifetime())
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

    let extension_message = {}

    for (const state of this.extensionHolders) {
      if (!state) {
        throw new Error('Tried to add invalid extension')
      }
      state.extension.setProtobufData(state, extension_message)
    }

    const expirationDate = this.expirationDate

    return new DynamicActivationCode({
      info: new CardInfo({
        fullName: this.fullName,
        expirationDay:
          expirationDate !== null && !this.hasInfiniteLifetime() ? dateToDaysSinceEpoch(expirationDate) : undefined,
        extensions: new CardExtensions(extension_message),
      }),
      pepper: pepper,
      totpSecret: totpSecret,
    })
  }
}

export const createEmptyBavariaCard = (region: Region): CardBlueprint =>
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
    {
      state: nuernberg_pass_number_extension.initialState,
      extension: nuernberg_pass_number_extension,
    },
    {
      state: birthday_extension.initialState,
      extension: birthday_extension,
    },
  ])
