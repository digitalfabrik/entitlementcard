import { PartialMessage } from '@bufbuild/protobuf'

import { maxCardValidity } from '../bp-modules/cards/AddCardForm'
import { CardExtensions, CardInfo } from '../generated/card_pb'
import { Region } from '../generated/graphql'
import { CardConfig } from '../project-configs/getProjectConfig'
import PlainDate from '../util/PlainDate'
import { REGION_EXTENSION_NAME } from './extensions/RegionExtension'
import Extensions, { Extension, ExtensionKey, ExtensionState, InferExtensionStateType } from './extensions/extensions'

// Due to limited space on the cards
const MAX_NAME_LENGTH = 30
// Due to limited space on the qr code
const MAX_ENCODED_NAME_LENGTH = 50

export type CardBlueprint = {
  id: number
  fullName: string
  expirationDate: number | null
  extensions: Partial<ExtensionState>
}

type CardBlueprintKey = keyof Omit<Omit<CardBlueprint, 'extensions'>, 'id'>
type KeyType = CardBlueprintKey | ExtensionKey | null

const createRandomId = () => Math.floor(Math.random() * 1000000)

export const initializeCardBlueprint = (
  cardConfig: CardConfig,
  region: Region | undefined = undefined,
  { id, fullName, expirationDate, extensions }: Partial<CardBlueprint> = {}
): CardBlueprint => {
  const defaultExpirationDate = PlainDate.fromLocalDate(new Date()).add(cardConfig.defaultValidity).toDaysSinceEpoch()
  const defaultExtensions = cardConfig.extensions.reduce(
    (acc, extension) => ({
      ...acc,
      ...extension.getInitialState(extension.name === REGION_EXTENSION_NAME ? region : undefined),
    }),
    {}
  )

  return {
    id: id ?? createRandomId(),
    fullName: fullName ?? '',
    extensions: {
      ...defaultExtensions,
      ...(extensions ?? {}),
    },
    expirationDate: expirationDate === undefined ? defaultExpirationDate : expirationDate,
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getExtensions = ({ extensions }: CardBlueprint) => {
  const extensionKeys = Object.keys(extensions) as (keyof typeof Extensions)[]
  return extensionKeys.map(key => {
    const extensionObject = Extensions.find(extension => extension.name === key)!
    type ExtensionStateType = InferExtensionStateType<typeof extensionObject>
    return { ...extensionObject, state: extensions } as Extension<ExtensionStateType> & { state: ExtensionStateType }
  })
}

export const hasInfiniteLifetime = (cardBlueprint: CardBlueprint): boolean =>
  getExtensions(cardBlueprint).some(extension => extension.causesInfiniteLifetime(extension.state))

export const isFullNameValid = ({ fullName }: CardBlueprint): boolean => {
  const encodedName = new TextEncoder().encode(fullName)
  return fullName.length > 0 && encodedName.length <= MAX_ENCODED_NAME_LENGTH && fullName.length <= MAX_NAME_LENGTH
}

export const isExpirationDateValid = (cardBlueprint: CardBlueprint, { nullable } = { nullable: false }): boolean => {
  const today = PlainDate.fromLocalDate(new Date())
  const expirationDate =
    cardBlueprint.expirationDate !== null ? PlainDate.fromDaysSinceEpoch(cardBlueprint.expirationDate) : null
  const startDay = cardBlueprint.extensions.startDay
  const startDayDate = startDay !== undefined ? PlainDate.fromDaysSinceEpoch(startDay) : null

  if (expirationDate === null) {
    return nullable
  }

  return (
    expirationDate.isAfter(today) &&
    expirationDate.isBefore(today.add(maxCardValidity)) &&
    (startDayDate ? startDayDate.isBefore(expirationDate) : true)
  )
}

export const isValid = (
  cardBlueprint: CardBlueprint,
  { expirationDateNullable } = { expirationDateNullable: false }
): boolean =>
  isFullNameValid(cardBlueprint) &&
  getExtensions(cardBlueprint).every(extension => extension.isValid(extension.state)) &&
  (isExpirationDateValid(cardBlueprint, { nullable: expirationDateNullable }) || hasInfiniteLifetime(cardBlueprint))

export const generateCardInfo = (cardBlueprint: CardBlueprint): CardInfo => {
  const extensionsMessage: PartialMessage<CardExtensions> = getExtensions(cardBlueprint).reduce(
    (acc, extension) => ({
      ...acc,
      ...extension.getProtobufData(extension.state),
    }),
    {}
  )

  const expirationDate = cardBlueprint.expirationDate
  const expirationDay =
    expirationDate !== null && !hasInfiniteLifetime(cardBlueprint) ? Math.max(expirationDate, 0) : undefined

  return new CardInfo({
    fullName: cardBlueprint.fullName,
    expirationDay,
    extensions: new CardExtensions(extensionsMessage),
  })
}

const getExtensionNameByCSVHeader = (cardConfig: CardConfig, columnHeader: string): ExtensionKey | null => {
  const extensionIndex = cardConfig.extensionColumnNames.indexOf(columnHeader)
  return (cardConfig.extensions[extensionIndex]?.name as ExtensionKey | undefined) ?? null
}

const getObjectKeyByCSVHeader = (cardConfig: CardConfig, columnHeader: string): CardBlueprintKey | null => {
  switch (columnHeader) {
    case cardConfig.nameColumnName:
      return 'fullName'
    case cardConfig.expiryColumnName:
      return 'expirationDate'
    default:
      return null
  }
}

const getKeyByCSVHeader = (cardConfig: CardConfig, columnHeader: string): KeyType =>
  getExtensionNameByCSVHeader(cardConfig, columnHeader) ?? getObjectKeyByCSVHeader(cardConfig, columnHeader)

export const isValueValid = (cardBlueprint: CardBlueprint, cardConfig: CardConfig, columnHeader: string): boolean => {
  switch (columnHeader) {
    case cardConfig.nameColumnName:
      return isFullNameValid(cardBlueprint)
    case cardConfig.expiryColumnName:
      return isExpirationDateValid(cardBlueprint) || hasInfiniteLifetime(cardBlueprint)
    default: {
      const extensionName = getExtensionNameByCSVHeader(cardConfig, columnHeader)
      const extension = getExtensions(cardBlueprint).find(extension => extension.name === extensionName)
      return extension?.isValid(extension.state) ?? false
    }
  }
}

export const getValueByCSVHeader = (
  cardBlueprint: CardBlueprint,
  cardConfig: CardConfig,
  columnHeader: string
): string | number | null => {
  const key = getKeyByCSVHeader(cardConfig, columnHeader)
  if (key === null) {
    return null
  }
  return Object.keys(cardBlueprint).includes(key)
    ? cardBlueprint[key as CardBlueprintKey]
    : cardBlueprint.extensions[key as keyof ExtensionState] ?? null
}

export const initializeCardFromCSV = (
  cardConfig: CardConfig,
  line: (string | null)[],
  headers: string[],
  region: Region,
  withDefaults = false
): CardBlueprint => {
  const defaultCard = withDefaults
    ? initializeCardBlueprint(cardConfig, region)
    : { fullName: '', expirationDate: null, extensions: { [REGION_EXTENSION_NAME]: region.id } }
  const extensions = headers.reduce((acc, header, index) => {
    const value = line[index]
    const extension = Extensions.find(extension => extension.name === getExtensionNameByCSVHeader(cardConfig, header))
    return extension && value != null
      ? {
          ...acc,
          ...extension.fromString(value),
        }
      : acc
  }, defaultCard.extensions)

  const fullName = line[headers.indexOf(cardConfig.nameColumnName)] ?? defaultCard.fullName
  const rawExpirationDate = line[headers.indexOf(cardConfig.expiryColumnName)]
  const expirationDate = PlainDate.safeEpochsFromCustomFormat(rawExpirationDate) ?? defaultCard.expirationDate

  return {
    id: createRandomId(),
    fullName,
    expirationDate,
    extensions,
  }
}

export const updateCard = (oldCard: CardBlueprint, updatedCard: Partial<CardBlueprint>): CardBlueprint => ({
  ...oldCard,
  ...updatedCard,
  extensions: {
    ...oldCard.extensions,
    ...(updatedCard.extensions ?? {}),
  },
})
