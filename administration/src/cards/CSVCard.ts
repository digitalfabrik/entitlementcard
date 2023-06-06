import { Region } from '../generated/graphql'
import { CardConfig } from '../project-configs/getProjectConfig'
import PlainDate from '../util/PlainDate'
import { CardBlueprint } from './CardBlueprint'

type HeaderMap = {
  [header: string]: {
    getValue: () => string | null
    setValue: (value: string) => void
    isValid: () => boolean
  }
}

class CSVCard extends CardBlueprint {
  private readonly headerMap: HeaderMap

  constructor(cardConfig: CardConfig, region: Region) {
    super('', cardConfig)

    this.headerMap = {
      [cardConfig.nameColumnName]: {
        getValue: () => this.fullName ?? null,
        setValue: value => (this.fullName = value),
        isValid: () => this.isFullNameValid(),
      },
      [cardConfig.expiryColumnName]: {
        getValue: () => (this.expirationDate ? this.expirationDate.format('dd.MM.yyyy') : null),
        setValue: value => this.setExpirationDate(value),
        isValid: () => this.isExpirationDateValid() || this.hasInfiniteLifetime(),
      },
    }

    this.extensions.forEach((extension, idx) => {
      const columnName = cardConfig.extensionColumnNames[idx]
      if (!columnName) {
        extension.setInitialState(region)
        return
      }

      this.headerMap[columnName] = {
        getValue: () => extension.toString(),
        setValue: (value: string) => extension.fromString(value),
        isValid: () => extension.isValid(),
      }
    })
  }

  setExpirationDate = (value: string) => {
    if (value.length === 0) return null
    try {
      this.expirationDate = PlainDate.fromCustomFormat(value, 'dd.MM.yyyy')
    } catch (error) {
      this.expirationDate = null
      console.error("Could not parse date from string '" + value + "' with format dd.MM.yyyy.", error)
    }
  }

  setValue = (header: string, value: string) => {
    this.headerMap[header]?.setValue(value)
  }

  getValue = (header: string) => {
    return this.headerMap[header]?.getValue() ?? null
  }

  isValueValid = (header: string): boolean => {
    return this.headerMap[header]?.isValid() ?? false
  }
}

export default CSVCard
