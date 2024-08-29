import { Region } from '../generated/graphql'
import { CardConfig } from '../project-configs/getProjectConfig'
import { CardBlueprint } from './CardBlueprint'

class CSVCard extends CardBlueprint {
  constructor(cardConfig: CardConfig, region: Region) {
    super('', cardConfig)

    this.extensions.forEach((extension, idx) => {
      const columnName = cardConfig.extensionColumnNames[idx]
      if (!columnName) {
        extension.setInitialState(region)
      }
    })
  }

  getValue(key: string): string | null {
    const extensionIdx = this.cardConfig.extensionColumnNames.indexOf(key)
    switch (key) {
      case this.cardConfig.nameColumnName:
        return this.fullName
      case this.cardConfig.expiryColumnName:
        return this.expirationDate ? this.expirationDate.format() : null
      default:
        if (extensionIdx === -1) {
          return null
        }
        return this.extensions[extensionIdx].toString()
    }
  }

  isValueValid = (key: string): boolean => {
    const extensionIdx = this.cardConfig.extensionColumnNames.indexOf(key)
    switch (key) {
      case this.cardConfig.nameColumnName:
        return this.isFullNameValid()
      case this.cardConfig.expiryColumnName:
        return this.isExpirationDateValid() || this.hasInfiniteLifetime()
      default:
        if (extensionIdx === -1) {
          return false
        }
        return this.extensions[extensionIdx].isValid()
    }
  }
}

export default CSVCard
