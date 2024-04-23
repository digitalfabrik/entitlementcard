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
        return
      }
    })
  }

  getValue(key: string): string | null {
    switch (key) {
      case this.cardConfig.nameColumnName:
        return this.fullName
      case this.cardConfig.expiryColumnName:
        return this.expirationDate ? this.expirationDate.format() : null
      default:
        const extensionIdx = this.cardConfig.extensionColumnNames.indexOf(key)
        if (extensionIdx === -1) {
          return null
        }
        return this.extensions[extensionIdx].toString()
    }
  }

  isValueValid = (key: string): boolean => {
    switch (key) {
      case this.cardConfig.nameColumnName:
        return this.isFullNameValid()
      case this.cardConfig.expiryColumnName:
        return this.isExpirationDateValid() || this.hasInfiniteLifetime()
      default:
        const extensionIdx = this.cardConfig.extensionColumnNames.indexOf(key)
        if (extensionIdx === -1) {
          return false
        }
        return this.extensions[extensionIdx].isValid()
    }
  }
}

export default CSVCard
