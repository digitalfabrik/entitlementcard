import { PartialMessage } from '@bufbuild/protobuf'
import { t } from 'i18next'

import { CardExtensions, CardInfo } from '../generated/card_pb'
import { Region } from '../generated/graphql'
import type { CardConfig } from '../project-configs/getProjectConfig'
import PlainDate from '../util/PlainDate'
import {
  containsOnlyLatinAndCommonCharset,
  containsSpecialCharacters,
  isExceedingMaxValidityDate,
} from '../util/helper'
import { normalizeWhitespace } from '../util/normalizeString'
import { maxCardValidity } from './constants'
import { REGION_EXTENSION_NAME } from './extensions/RegionExtension'
import type {
  Extension,
  ExtensionKey,
  ExtensionState,
  InferExtensionStateType,
} from './extensions/extensions'
import Extensions from './extensions/extensions'

// Due to limited space on the cards
export const MAX_NAME_LENGTH = 30
// Due to limited space on the qr code
const MAX_ENCODED_NAME_LENGTH = 50

export type Card = {
  id: number
  fullName: string
  expirationDate: PlainDate | null
  extensions: Partial<ExtensionState>
}

const createRandomId = () => Math.floor(Math.random() * 1000000)

const getInitialExtensionState = (cardConfig: CardConfig, region: Region | undefined) =>
  cardConfig.extensions.reduce(
    (acc, extension) =>
      Object.assign(
        acc,
        extension.getInitialState(extension.name === REGION_EXTENSION_NAME ? region : undefined),
      ),
    {},
  )

export const initializeCard = (
  cardConfig: CardConfig,
  region: Region | undefined = undefined,
  { id, fullName, expirationDate, extensions }: Partial<Card> = {},
): Card => {
  const defaultExpirationDate = PlainDate.fromLocalDate(new Date()).add(cardConfig.defaultValidity)

  return {
    id: id ?? createRandomId(),
    fullName: fullName ?? '',
    extensions: {
      ...getInitialExtensionState(cardConfig, region),
      ...(extensions ?? {}),
    },
    expirationDate: expirationDate === undefined ? defaultExpirationDate : expirationDate,
  }
}

type ExtensionWithState = {
  extension: Extension<InferExtensionStateType<(typeof Extensions)[number]>>
  state: InferExtensionStateType<(typeof Extensions)[number]>
}
export const getExtensions = ({ extensions }: Card): ExtensionWithState[] => {
  const extensionKeys = Object.keys(extensions) as (keyof typeof Extensions)[]
  return extensionKeys.map(key => {
    const extensionObject = Extensions.find(extension => extension.name === key)!
    type ExtensionStateType = InferExtensionStateType<typeof extensionObject>
    // @ts-expect-error key is always a valid key
    return { extension: extensionObject, state: { [key]: extensions[key] } } as {
      extension: Extension<ExtensionStateType>
      state: ExtensionStateType
    }
  })
}

export type SerializedCard = {
  id: number
  fullName: string
  expirationDate: string | null
  extensions: { [key: string]: string }
}
export const serializeCard = (card: Card): SerializedCard => ({
  id: card.id,
  fullName: card.fullName,
  expirationDate: card.expirationDate?.formatISO() ?? null,
  extensions: getExtensions(card).reduce(
    (acc, extension) => ({
      ...acc,
      [extension.extension.name]: extension.extension.serialize(extension.state),
    }),
    {},
  ),
})

export const deserializeCard = (serializedCard: SerializedCard, cardConfig: CardConfig): Card => ({
  id: serializedCard.id,
  fullName: serializedCard.fullName,
  expirationDate: PlainDate.safeFrom(serializedCard.expirationDate),
  extensions: Object.entries(serializedCard.extensions).reduce((acc, [key, value]) => {
    const extension = cardConfig.extensions.find(it => it.name === key)
    return extension ? { ...acc, ...extension.fromSerialized(value) } : acc
  }, {}),
})

export const hasInfiniteLifetime = (card: Card): boolean =>
  getExtensions(card).some(({ extension, state }) => extension.causesInfiniteLifetime(state))

const hasValidNameLength = (fullName: string): boolean => {
  const encodedName = new TextEncoder().encode(fullName)
  return (
    fullName.length > 0 &&
    encodedName.length <= MAX_ENCODED_NAME_LENGTH &&
    fullName.length <= MAX_NAME_LENGTH
  )
}

export const isFullNameValid = ({ fullName }: Card): boolean => {
  const normalizedName = normalizeWhitespace(fullName)
  return (
    hasValidNameLength(normalizedName) &&
    containsOnlyLatinAndCommonCharset(normalizedName) &&
    !containsSpecialCharacters(normalizedName)
  )
}

export const isExpirationDateValid = (card: Card, { nullable } = { nullable: false }): boolean => {
  const today = PlainDate.fromLocalDate(new Date())
  const startDay = card.extensions.startDay

  if (card.expirationDate === null) {
    return nullable
  }

  return (
    card.expirationDate.isAfter(today) &&
    !isExceedingMaxValidityDate(card.expirationDate) &&
    (startDay?.isBefore(card.expirationDate) ?? true)
  )
}

export const cardHasAllMandatoryExtensions = (card: Card, cardConfig: CardConfig): boolean => {
  const mandatoryExtensions = cardConfig.extensions.filter(extension => extension.isMandatory)
  return mandatoryExtensions.every(extension =>
    Object.keys(card.extensions).includes(extension.name),
  )
}

export const isValid = (
  card: Card,
  cardConfig: CardConfig,
  { expirationDateNullable } = { expirationDateNullable: false },
): boolean =>
  isFullNameValid(card) &&
  getExtensions(card).every(({ extension, state }) => extension.isValid(state)) &&
  (isExpirationDateValid(card, { nullable: expirationDateNullable }) ||
    hasInfiniteLifetime(card)) &&
  cardHasAllMandatoryExtensions(card, cardConfig)

export const generateCardInfo = (card: Card): CardInfo => {
  const extensionsMessage: PartialMessage<CardExtensions> = getExtensions(card).reduce(
    (acc, { extension, state }) => Object.assign(acc, extension.getProtobufData(state)),
    {},
  )

  const expirationDate = card.expirationDate
  const expirationDay =
    expirationDate !== null && !hasInfiniteLifetime(card)
      ? Math.max(expirationDate.toDaysSinceEpoch(), 0)
      : undefined

  return new CardInfo({
    fullName: card.fullName,
    expirationDay,
    extensions: new CardExtensions(extensionsMessage),
  })
}

const getExtensionNameByCSVHeader = (
  cardConfig: CardConfig,
  columnHeader: string,
): ExtensionKey | null => {
  const extensionIndex = cardConfig.extensionColumnNames.indexOf(columnHeader)
  return (cardConfig.extensions[extensionIndex]?.name as ExtensionKey | undefined) ?? null
}

export const isValueValid = (card: Card, cardConfig: CardConfig, columnHeader: string): boolean => {
  switch (columnHeader) {
    case cardConfig.nameColumnName:
      return isFullNameValid(card)
    case cardConfig.expiryColumnName:
      return isExpirationDateValid(card) || hasInfiniteLifetime(card)
    default: {
      const extensionName = getExtensionNameByCSVHeader(cardConfig, columnHeader)
      const extension = cardConfig.extensions.find(extension => extension.name === extensionName)
      return extension?.isValid(card.extensions) ?? false
    }
  }
}

export const getValueByCSVHeader = (
  card: Card,
  cardConfig: CardConfig,
  columnHeader: string,
): string | number | undefined => {
  switch (columnHeader) {
    case cardConfig.nameColumnName:
      return card.fullName
    case cardConfig.expiryColumnName:
      return card.expirationDate?.format()
    default: {
      const extensionName = getExtensionNameByCSVHeader(cardConfig, columnHeader)
      const extension = getExtensions(card).find(
        ({ extension }) => extension.name === extensionName,
      )
      return extension?.extension.toString(extension.state)
    }
  }
}

export const initializeCardFromCSV = (
  cardConfig: CardConfig,
  line: (string | null)[],
  headers: string[],
  region: Region | undefined,
  withDefaults = false,
): Card => {
  const defaultCard = withDefaults
    ? initializeCard(cardConfig, region)
    : {
        fullName: '',
        expirationDate: null,
        extensions: region ? { [REGION_EXTENSION_NAME]: region.id } : {},
      }
  const extensions = headers.reduce((acc, header, index) => {
    const value = line[index]
    const extension = cardConfig.extensions.find(
      extension => extension.name === getExtensionNameByCSVHeader(cardConfig, header),
    )
    return extension && value != null ? Object.assign(acc, extension.fromString(value)) : acc
  }, defaultCard.extensions)

  const fullName = normalizeWhitespace(
    line[headers.indexOf(cardConfig.nameColumnName)] ?? defaultCard.fullName,
  )
  const rawExpirationDate = line[headers.indexOf(cardConfig.expiryColumnName)]
  const expirationDate =
    PlainDate.safeFromCustomFormat(rawExpirationDate) ?? defaultCard.expirationDate

  return {
    id: createRandomId(),
    fullName,
    expirationDate,
    extensions,
  }
}

export const updateCard = (oldCard: Card, updatedCard: Partial<Card>): Card => ({
  ...oldCard,
  ...updatedCard,
  extensions: {
    ...oldCard.extensions,
    ...(updatedCard.extensions ?? {}),
  },
})

export const getFullNameValidationErrorMessage = (name: string): string => {
  const normalizedName = normalizeWhitespace(name)
  const errors: string[] = []
  if (!normalizedName) {
    return t('cards:fullNameValidationInvalidNameError')
  }
  if (
    !containsOnlyLatinAndCommonCharset(normalizedName) ||
    containsSpecialCharacters(normalizedName)
  ) {
    errors.push(t('cards:fullNameValidationSpecialCharactersError'))
  }
  if (!hasValidNameLength(normalizedName)) {
    errors.push(t('cards:fullNameValidationMaxNameLengthError', { maxNameLength: MAX_NAME_LENGTH }))
  }
  return errors.join(' ')
}

export const getExpirationDateErrorMessage = (card: Card): string => {
  const startDay = card.extensions.startDay
  const today = PlainDate.fromLocalDate(new Date())
  const errors: string[] = []
  if (!card.expirationDate) {
    return t('cards:expirationDateError')
  }
  if (card.expirationDate.isBeforeOrEqual(today)) {
    errors.push(t('cards:expirationDateNotInFutureError'))
  }
  if (startDay && card.expirationDate.isBeforeOrEqual(startDay)) {
    errors.push(t('cards:expirationDateBeforeStartDayError'))
  }
  if (isExceedingMaxValidityDate(card.expirationDate)) {
    errors.push(
      t('cards:expirationDateFutureError', {
        maxValidationDate: today.add(maxCardValidity).format(),
      }),
    )
  }
  return errors.join(' ')
}
