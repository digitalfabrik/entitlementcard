import { BAVARIA_CARD_TYPE_GOLD, BAVARIA_CARD_TYPE_STANDARD } from '../../../cards/extensions/BavariaCardTypeExtension'
import { ProjectConfig } from '../../../project-configs/getProjectConfig'

const FREINET_EXPIRATION_DATE_COLUMN_HEADER = 'eak_datum'
const FREINET_FIRSTNAME_COLUMN_HEADER = 'vorname'
const FREINET_LASTNAME_COLUMN_HEADER = 'nachname'
const FREINET_CARDTYPE_COLUMN_HEADER = 'inhaber_ehrenamtskarte'

const mergeFirstAndLastnameIntoNewColumn = (line: string[], csvHeader: string[], nameColumnName: string) => {
  const columnNameDoesNotExist = csvHeader.indexOf(nameColumnName) === -1
  if (columnNameDoesNotExist) {
    csvHeader[csvHeader.length] = nameColumnName
  }

  const indexFirstName = csvHeader.indexOf(FREINET_FIRSTNAME_COLUMN_HEADER)
  const indexLastName = csvHeader.indexOf(FREINET_LASTNAME_COLUMN_HEADER)
  const fullname =
    !!line[indexFirstName] && !!line[indexLastName] ? `${line[indexFirstName]} ${line[indexLastName]}` : ''
  line[csvHeader.indexOf(nameColumnName)] = fullname.trim()
}

const renameExpirationDateHeader = (csvHeader: string[], expiryColumnName: string) => {
  const indexExpirationDate = csvHeader.indexOf(FREINET_EXPIRATION_DATE_COLUMN_HEADER)
  if (indexExpirationDate !== -1) {
    csvHeader[indexExpirationDate] = expiryColumnName
  }
}

const getCardTypeByFreinetValue = (line: string[], indexCardTypeFreinet: number): string =>
  line[indexCardTypeFreinet].toLowerCase().includes('blau') ? BAVARIA_CARD_TYPE_STANDARD : BAVARIA_CARD_TYPE_GOLD

const getCardTypeByExpirationDate = (line: string[], indexOfExpirationDate: number): string =>
  line[indexOfExpirationDate] ? BAVARIA_CARD_TYPE_STANDARD : BAVARIA_CARD_TYPE_GOLD

const setCardType = (line: string[], csvHeader: string[], cardTypeColumnName: string, expiryColumnName: string) => {
  const indexCardTypeFreinet = csvHeader.indexOf(FREINET_CARDTYPE_COLUMN_HEADER)

  const hasValidCardTypeColumn = csvHeader.indexOf(cardTypeColumnName) !== -1
  if (!hasValidCardTypeColumn) {
    csvHeader[csvHeader.length] = cardTypeColumnName
  }
  const indexCardType = csvHeader.indexOf(cardTypeColumnName)

  const hasFreinetCardType = indexCardTypeFreinet !== -1

  line[indexCardType] = hasFreinetCardType
    ? getCardTypeByFreinetValue(line, indexCardTypeFreinet)
    : getCardTypeByExpirationDate(line, csvHeader.indexOf(expiryColumnName))
}

/** *
 * Converts Freinet CSV export data into valid input for CSV import
 * @param line The line of the Freinet CSV export
 * @param csvHeader the header of the Freinet CSV Export
 * @param projectConfig the config of the current project
 *
 * Format of the input must be:
 *      columns with the header "vorname" and "nachname" must exist
 *      column with the header expiration date must exist and be called "eak_datum"
 *      column with the name "inhaber_ehrenamtskarte" can exist, if so it is used, if not the expiration date is used
 */
const convertFreinetLineAndHeaders = (line: string[], csvHeader: string[], projectConfig: ProjectConfig): void => {
  mergeFirstAndLastnameIntoNewColumn(line, csvHeader, projectConfig.card.nameColumnName)
  renameExpirationDateHeader(csvHeader, projectConfig.card.expiryColumnName)
  if (projectConfig.card.extensionColumnNames[0]) {
    setCardType(line, csvHeader, projectConfig.card.extensionColumnNames[0], projectConfig.card.expiryColumnName)
  }
}

const convertFreinetImport = (file: string[][], projectConig: ProjectConfig): string[][] => {
  const [headers, ...lines] = file
  lines.forEach(it => convertFreinetLineAndHeaders(it, headers, projectConig))
  return [headers, ...lines]
}

export default convertFreinetImport
