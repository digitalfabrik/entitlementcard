import { format, isValid as isDateValid, parse } from 'date-fns'

import { Region } from '../generated/graphql'
import { CardConfig } from '../project-configs/getProjectConfig'
import { CardBlueprint } from './CardBlueprint'

type HeaderMap = {
  [header: string]: {
    getValue: () => string | null
    setValue: (value: string) => void
    isValid: () => boolean
  }
}

class CSVCard extends CardBlueprint {
  private headerMap: HeaderMap

  constructor(cardConfig: CardConfig, region: Region) {
    super('', cardConfig)

    this.headerMap = {
      [cardConfig.nameColumnName]: {
        getValue: () => this.fullName ?? null,
        setValue: value => (this.fullName = value),
        isValid: () => this.isFullNameValid(),
      },
      [cardConfig.expiryColumnName]: {
        getValue: () => (this.expirationDate ? format(this.expirationDate, 'dd.MM.yyyy') : null),
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
    this.expirationDate = parse(value, 'dd.MM.yyyy', new Date())
    if (!isDateValid(this.expirationDate)) {
      this.expirationDate = null
    }
  }

  setValue = (header: string, value: string) => {
    this.headerMap[header].setValue(value)
  }

  getValue = (header: string) => {
    if (header) return this.headerMap[header].getValue()
  }

  isValueValid = (header: string): boolean => {
    return this.headerMap[header].isValid()
  }
}

export default CSVCard
