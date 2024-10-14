import { Region } from '../generated/graphql'
import PlainDate from '../util/PlainDate'
import { getValueByCSVHeader, initializeCardFromCSV, isValid, isValueValid } from './CardBlueprint'
import BavariaCardTypeExtension, { BAVARIA_CARD_TYPE_EXTENSION_NAME } from './extensions/BavariaCardTypeExtension'
import RegionExtension, { REGION_EXTENSION_NAME } from './extensions/RegionExtension'

describe('CSVCard', () => {
  const region: Region = {
    id: 0,
    name: 'augsburg',
    prefix: 'a',
    activatedForApplication: true,
    activatedForCardConfirmationMail: true,
  }

  const cardConfig = {
    defaultValidity: { years: 3 },
    nameColumnName: 'Name',
    expiryColumnName: 'Ablaufdatum',
    extensionColumnNames: ['Kartentyp', null],
    extensions: [BavariaCardTypeExtension, RegionExtension],
  }

  it('should correctly initialize CSVCard', () => {
    const card = initializeCardFromCSV(cardConfig, [], [], region)

    expect(card.fullName).toBe('')
    expect(card.expirationDate).toBeNull()
    expect(card.extensions[BAVARIA_CARD_TYPE_EXTENSION_NAME]).toBeUndefined()
    expect(card.extensions[REGION_EXTENSION_NAME]).toBe(0)
  })

  it('should correctly set and get value', () => {
    const dateString = '03.04.2022'
    const date = PlainDate.fromCustomFormat(dateString).toDaysSinceEpoch()
    const line = ['Thea Test', dateString, 'Goldkarte']
    const headers = ['Name', 'Ablaufdatum', 'Kartentyp']
    const card = initializeCardFromCSV(cardConfig, line, headers, region)

    expect(card.fullName).toBe('Thea Test')
    expect(card.expirationDate).toEqual(date)
    expect(card.extensions[BAVARIA_CARD_TYPE_EXTENSION_NAME]).toBe('Goldkarte')

    expect(isValueValid(card, cardConfig, 'Name')).toBeTruthy()
    expect(isValueValid(card, cardConfig, 'Ablaufdatum')).toBeTruthy()
    expect(isValueValid(card, cardConfig, 'Kartentyp')).toBeTruthy()
    expect(isValid(card)).toBeTruthy()

    expect(getValueByCSVHeader(card, cardConfig, 'Name')).toBe('Thea Test')
    expect(getValueByCSVHeader(card, cardConfig, 'Ablaufdatum')).toBe(date)
    expect(getValueByCSVHeader(card, cardConfig, 'Kartentyp')).toBe('Goldkarte')
  })

  it('should not modify value for invalid header', () => {
    const line = ['1']
    const headers = ['Region']
    const card = initializeCardFromCSV(cardConfig, line, headers, region)

    expect(card.fullName).toBe('')

    expect(getValueByCSVHeader(card, cardConfig, 'Region')).toBeNull()
  })

  it('should correctly identify invalid values', () => {
    const line = ['2012/03/02', 'Graublau']
    const headers = ['Ablaufdatum', 'Kartentyp']
    const card = initializeCardFromCSV(cardConfig, line, headers, region)

    expect(card.fullName).toBe('')
    expect(getValueByCSVHeader(card, cardConfig, 'Name')).toBe('')
    expect(card.expirationDate).toBeNull()
    expect(getValueByCSVHeader(card, cardConfig, 'Ablaufdatum')).toBeNull()
    expect(card.extensions[BAVARIA_CARD_TYPE_EXTENSION_NAME]).toBeUndefined()
    expect(getValueByCSVHeader(card, cardConfig, 'Kartentyp')).toBeNull()

    expect(isValueValid(card, cardConfig, 'Name')).toBeFalsy()
    expect(isValueValid(card, cardConfig, 'Ablaufdatum')).toBeFalsy()
    expect(isValueValid(card, cardConfig, 'Kartentyp')).toBeFalsy()
    expect(isValid(card)).toBeFalsy()
  })
})
