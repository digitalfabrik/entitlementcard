import { CardExtensions, CardInfo, DynamicActivationCode, QrCode, StaticVerifyCode } from '../generated/card_pb'
import { dateToDaysSinceEpoch } from './validityPeriod'
import { ExtensionHolder } from './extensions'

const MAX_NAME_LENGTH = 50
const TOTP_SECRET_LENGTH = 20
const PEPPER_LENGTH = 16

/**
 * Blueprint for a new card. This object contains data about a future card, which will be created.
 */
export class CardBlueprint {
  id: number
  fullName: string
  expirationDate: Date | null
  extensionHolders: ExtensionHolder<any>[]

  constructor(fullName: string, expirationDate: Date | null, extension_states: ExtensionHolder<any>[]) {
    this.fullName = fullName
    this.expirationDate = expirationDate
    this.extensionHolders = extension_states

    this.id = Math.floor(Math.random() * 1000000) // Assign some random ID
  }

  hasInfiniteLifetime(): boolean {
    return !!this.extensionHolders.find(state => state.extension.causesInfiniteLifetime(state.state))
  }

  isFullNameValid(): boolean {
    const encodedName = new TextEncoder().encode(this.fullName)
    return this.fullName.length > 0 && encodedName.length < MAX_NAME_LENGTH
  }

  isExpirationDateValid(): boolean {
    return this.expirationDate !== null && this.expirationDate > new Date()
  }

  isValid(): boolean {
    return (
      // Name valid
      this.isFullNameValid() &&
      // Extensions valid
      this.extensionHolders.every(state => state.extension.isValid(state.state)) &&
      // Expiration date valid
      (this.isExpirationDateValid() || this.hasInfiniteLifetime()) &&
      // Number of bytes is valid
      this.hasValidSize()
    )
  }

  hasValidSize(): boolean {
    // every four characters in a base64 encoded string correspond to three bytes
    // the qr code can hold 224 characters
    // therefore 224 / 4 * 3 = 168
    // See https://github.com/digitalfabrik/entitlementcard/issues/690  for more context.
    return this.sizeOfProtobuf() <= 168
  }

  sizeOfProtobuf(): number {
    return new QrCode({ qrCode: { value: this.generateActivationCode(), case: 'dynamicActivationCode' } }).toBinary()
      .length
  }
    
  generateCardInfo = (): CardInfo => {
    let extension_message = {}

    for (const state of this.extensionHolders) {
      if (!state) {
        throw new Error('Tried to add invalid extension')
      }
      state.extension.setProtobufData(state, extension_message)
    }

    const expirationDate = this.expirationDate

    return new CardInfo({
      fullName: this.fullName,
      expirationDay:
        expirationDate !== null && !this.hasInfiniteLifetime() ? dateToDaysSinceEpoch(expirationDate) : undefined,
      extensions: new CardExtensions(extension_message),
    })
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

    return new DynamicActivationCode({
      info: this.generateCardInfo(),
      pepper: pepper,
      totpSecret: totpSecret,
    })
  }

  generateStaticVerifyCode = (): StaticVerifyCode => {
    if (!window.isSecureContext) {
      // localhost is considered secure.
      throw Error('Environment is not considered secure nor are we using Internet Explorer.')
    }
    const pepper = new Uint8Array(PEPPER_LENGTH) // 128 bit randomness
    crypto.getRandomValues(pepper)

    return new StaticVerifyCode({
      info: this.generateCardInfo(),
      pepper: pepper,
    })
  }
}
