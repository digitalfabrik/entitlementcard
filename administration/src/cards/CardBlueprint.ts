import { PartialMessage } from '@bufbuild/protobuf'
import { add } from 'date-fns'

import { CardExtensions, CardInfo, DynamicActivationCode, QrCode, StaticVerificationCode } from '../generated/card_pb'
import { Region } from '../generated/graphql'
import { CardConfig } from '../project-configs/getProjectConfig'
import { isContentLengthValid } from '../util/qrcode'
import RegionExtension from './extensions/RegionExtension'
import { Extension, ExtensionInstance, JSONExtension } from './extensions/extensions'
import { PEPPER_LENGTH } from './hashCardInfo'
import { dateToDaysSinceEpoch } from './validityPeriod'

const MAX_NAME_LENGTH = 50
const ACTIVATION_SECRET_LENGTH = 20

export interface JSONCardBlueprint<E = ExtensionInstance> {
  id: number
  fullName: string
  expirationDate: Date | null
  extensions: (E extends Extension<infer T, any> ? JSONExtension<T> : never)[]
}

/**
 * Blueprint for a new card. This object contains data about a future card, which will be created.
 */
export class CardBlueprint implements JSONCardBlueprint {
  id: number
  fullName: string
  expirationDate: Date | null
  extensions: ExtensionInstance[]

  constructor(fullName: string, cardConfig: CardConfig, initParams?: Parameters<CardBlueprint['initialize']>) {
    this.fullName = fullName
    this.expirationDate = cardConfig.defaultValidity && initParams ? add(new Date(), cardConfig.defaultValidity) : null
    this.extensions = cardConfig.extensions.map(Extension => new Extension())
    this.id = Math.floor(Math.random() * 1000000) // Assign some random ID
    if (initParams) {
      this.initialize(...initParams)
    }
  }

  initialize(region: Region) {
    this.extensions.forEach(ext => {
      if (ext instanceof RegionExtension) ext.setInitialState(region)
      else ext.setInitialState()
    })
  }

  hasInfiniteLifetime(): boolean {
    return this.extensions.some(ext => ext.causesInfiniteLifetime())
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
      this.extensions.every(ext => ext.isValid()) &&
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

    this.extensions.forEach(extension => {
      if (extension.state === null || !extension.setProtobufData) {
        // We allow to skip invalid extensions to enable computing the protobuf size.
        return
      }
      extension.setProtobufData(extensionsMessage)
    })

    const expirationDate = this.expirationDate

    return new CardInfo({
      fullName: this.fullName,
      expirationDay:
        expirationDate !== null && expirationDate.getTime() > 0 && !this.hasInfiniteLifetime()
          ? dateToDaysSinceEpoch(expirationDate)
          : undefined,
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

export default CardBlueprint
