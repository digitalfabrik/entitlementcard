import { CardExtensions, CardInfo, DynamicActivationCode, QrCode, StaticVerificationCode } from '../generated/card_pb'
import { dateToDaysSinceEpoch } from './validityPeriod'
import { ExtensionHolder } from './extensions'
import { PEPPER_LENGTH } from './hashCardInfo'
import { PartialMessage } from '@bufbuild/protobuf'
import { isContentLengthValid } from '../util/qrcode'

const MAX_NAME_LENGTH = 50
const ACTIVATION_SECRET_LENGTH = 20

/**
 * Blueprint for a new card. This object contains data about a future card, which will be created.
 */
export class CardBlueprint {
  id: number
  fullName: string
  expirationDate: Date | null
  extensionHolders: ExtensionHolder<any, any>[]

  constructor(fullName: string, expirationDate: Date | null, extension_states: ExtensionHolder<any, any>[]) {
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
    // See https://github.com/digitalfabrik/entitlementcard/issues/690  for more context.

    const dynamicCode = new QrCode({
      qrCode: { value: this.generateActivationCode(), case: 'dynamicActivationCode' },
    }).toBinary()

    const staticCode = new QrCode({
      qrCode: { value: this.generateStaticVerificationCode(), case: 'staticVerificationCode' },
    }).toBinary()

    return isContentLengthValid(dynamicCode) && isContentLengthValid(staticCode)
  }

  generateCardInfo = (): CardInfo => {
    const extensionsMessage: PartialMessage<CardExtensions> = {}

    for (const holder of this.extensionHolders) {
      if (holder.state === null) {
        // We allow to skip invalid extensions to enable computing the protobuf size.
        continue
      }
      holder.extension.setProtobufData(holder.state, extensionsMessage)
    }

    const expirationDate = this.expirationDate

    return new CardInfo({
      fullName: this.fullName,
      expirationDay:
        expirationDate !== null && !this.hasInfiniteLifetime() ? dateToDaysSinceEpoch(expirationDate) : undefined,
      extensions: new CardExtensions(extensionsMessage),
    })
  }

  generateActivationCode = (): DynamicActivationCode => {
    if (!window.isSecureContext) {
      // localhost is considered secure.
      throw Error('Environment is not considered secure nor are we using Internet Explorer.')
    }
    const pepper = new Uint8Array(PEPPER_LENGTH) // 128 bit randomness
    crypto.getRandomValues(pepper)

    const activationSecret = new Uint8Array(ACTIVATION_SECRET_LENGTH)
    crypto.getRandomValues(activationSecret)

    return new DynamicActivationCode({
      info: this.generateCardInfo(),
      pepper: pepper,
      activationSecret: activationSecret,
    })
  }

  generateStaticVerificationCode = (): StaticVerificationCode => {
    if (!window.isSecureContext) {
      // localhost is considered secure.
      throw Error('Environment is not considered secure nor are we using Internet Explorer.')
    }
    const pepper = new Uint8Array(PEPPER_LENGTH) // 128 bit randomness
    crypto.getRandomValues(pepper)

    return new StaticVerificationCode({
      info: this.generateCardInfo(),
      pepper: pepper,
    })
  }
}
