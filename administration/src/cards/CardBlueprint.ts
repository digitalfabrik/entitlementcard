import { PartialMessage } from '@bufbuild/protobuf'

import { maxCardValidity } from '../bp-modules/cards/AddCardForm'
import { CardExtensions, CardInfo } from '../generated/card_pb'
import { Region } from '../generated/graphql'
import { CardConfig } from '../project-configs/getProjectConfig'
import PlainDate from '../util/PlainDate'
import RegionExtension from './extensions/RegionExtension'
import StartDayExtension from './extensions/StartDayExtension'
import { Extension, ExtensionInstance, JSONExtension, findExtension } from './extensions/extensions'

// Due to limited space on the cards
const MAX_NAME_LENGTH = 30
// Due to limited space on the qr code
const MAX_ENCODED_NAME_LENGTH = 50

export type JSONCardBlueprint<E = ExtensionInstance> = {
  id: number
  fullName: string
  expirationDate: string | null
  extensions: (E extends Extension<infer T, unknown> ? JSONExtension<T> : never)[]
}

/**
 * Blueprint for a new card. This object contains data about a future card, which will be created.
 */
export class CardBlueprint {
  id: number
  fullName: string
  expirationDate: PlainDate | null
  extensions: ExtensionInstance[]
  cardConfig: CardConfig

  constructor(fullName: string, cardConfig: CardConfig, initParams?: Parameters<CardBlueprint['initialize']>) {
    this.cardConfig = cardConfig
    this.fullName = fullName
    this.expirationDate = initParams ? PlainDate.fromLocalDate(new Date()).add(cardConfig.defaultValidity) : null
    this.extensions = cardConfig.extensions.map(Extension => new Extension())
    this.id = Math.floor(Math.random() * 1000000) // Assign some random ID
    if (initParams) {
      this.initialize(...initParams)
    }
  }

  setValue(key: string, value: string): void {
    const extensionIdx = this.cardConfig.extensionColumnNames.indexOf(key)
    switch (key) {
      case this.cardConfig.nameColumnName:
        this.fullName = value
        break
      case this.cardConfig.expiryColumnName:
        this.setExpirationDate(value)
        break
      default:
        if (extensionIdx === -1) {
          return
        }
        this.extensions[extensionIdx].fromString(value)
    }
  }

  initialize(region: Region): void {
    this.extensions.forEach(ext => {
      if (ext instanceof RegionExtension) {
        ext.setInitialState(region)
      } else {
        ext.setInitialState()
      }
    })
  }

  hasInfiniteLifetime(): boolean {
    return this.extensions.some(ext => ext.causesInfiniteLifetime())
  }

  isFullNameValid(): boolean {
    const encodedName = new TextEncoder().encode(this.fullName)
    return (
      this.fullName.length > 0 &&
      encodedName.length <= MAX_ENCODED_NAME_LENGTH &&
      this.fullName.length <= MAX_NAME_LENGTH
    )
  }

  isStartDayBeforeExpirationDay = (expirationDate: PlainDate): boolean => {
    const startDayExtension = findExtension(this.extensions, StartDayExtension)
    return startDayExtension?.state?.startDay === undefined
      ? true
      : PlainDate.fromDaysSinceEpoch(startDayExtension.state.startDay).isBefore(expirationDate)
  }

  isExpirationDateValid(): boolean {
    const today = PlainDate.fromLocalDate(new Date())
    return (
      this.expirationDate !== null &&
      this.expirationDate.isAfter(today) &&
      !this.expirationDate.isAfter(today.add(maxCardValidity)) &&
      this.isStartDayBeforeExpirationDay(this.expirationDate)
    )
  }

  setExpirationDate(value: string): void {
    if (value.length === 0) {
      return
    }
    try {
      this.expirationDate = PlainDate.fromCustomFormat(value)
    } catch (error) {
      console.error(`Could not parse date from string '${value}' with format dd.MM.yyyy.`, error)
    }
  }

  isValid(): boolean {
    return (
      // Name valid
      this.isFullNameValid() &&
      // Extensions valid
      this.extensions.every(ext => ext.isValid()) &&
      // Expiration date valid
      (this.isExpirationDateValid() || this.hasInfiniteLifetime())
    )
  }

  generateCardInfo = (): CardInfo => {
    const extensionsMessage: PartialMessage<CardExtensions> = {}

    this.extensions.forEach(extension => {
      if (extension.state === null || !extension.setProtobufData) {
        return
      }
      extension.setProtobufData(extensionsMessage)
    })

    const expirationDate = this.expirationDate
    const expirationDay =
      expirationDate !== null && !this.hasInfiniteLifetime()
        ? Math.max(expirationDate.toDaysSinceEpoch(), 0)
        : undefined

    return new CardInfo({
      fullName: this.fullName,
      expirationDay,
      extensions: new CardExtensions(extensionsMessage),
    })
  }
}

export default CardBlueprint
