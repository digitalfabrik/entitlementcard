import CSVCard from './CSVCard'
import BavariaCardTypeExtension from './extensions/BavariaCardTypeExtension'
import RegionExtension from './extensions/RegionExtension'

jest.useFakeTimers()

describe('CSVCard', () => {
  const region = {
    id: 0,
    name: 'augsburg',
    prefix: 'a',
    activatedForApplication: true,
  }

  const cardConfig = {
    defaultValidity: { years: 3 },
    nameColumnName: 'Name',
    expiryColumnName: 'Ablaufdatum',
    extensionColumnNames: ['Kartentyp', null],
    extensions: [BavariaCardTypeExtension, RegionExtension],
  }

  it('should correctly initialize CSVCard', () => {
    const card = new CSVCard(cardConfig, region)

    expect(card.fullName).toBe('')
    expect(card.expirationDate).toBeNull()
    expect(card.extensions[0].state).toBeNull()
    expect(card.extensions[1].state).toEqual({ regionId: 0 })
  })

  it('should correctly set and get value', () => {
    const card = new CSVCard(cardConfig, region)

    card.setValue('Name', 'Thea Test')
    card.setValue('Ablaufdatum', '03.04.2022')
    card.setValue('Kartentyp', 'Goldkarte')

    expect(card.fullName).toBe('Thea Test')
    expect(card.expirationDate).toEqual(new Date(2022, 3, 3))
    expect(card.extensions[0].state).toBe('Goldkarte')

    expect(card.isValueValid('Name')).toBeTruthy()
    expect(card.isValueValid('Ablaufdatum')).toBeTruthy()
    expect(card.isValueValid('Kartentyp')).toBeTruthy()
    expect(card.isValid()).toBeTruthy()

    expect(card.getValue('Name')).toBe('Thea Test')
    expect(card.getValue('Ablaufdatum')).toBe('03.04.2022')
    expect(card.getValue('Kartentyp')).toBe('Goldkarte')
  })

  it('should not modify value for invalid header', () => {
    const card = new CSVCard(cardConfig, region)

    card.setValue('Region', '1')

    expect(card.extensions[1].state).toEqual({ regionId: 0 })
    expect(card.getValue('Region')).toBeFalsy()
  })

  it('should correctly identify invalid values', () => {
    const card = new CSVCard(cardConfig, region)

    card.setValue('Ablaufdatum', '2012/03/02')
    card.setValue('Kartentyp', 'Graublau')

    expect(card.isValueValid('Name')).toBeFalsy()
    expect(card.expirationDate).toBeNull()
    expect(card.getValue('Ablaufdatum')).toBeFalsy()
    expect(card.isValueValid('Ablaufdatum')).toBeFalsy()
    expect(card.extensions[0].state).toBeNull()
    expect(card.getValue('Kartentyp')).toBeFalsy()
    expect(card.isValueValid('Kartentyp')).toBeFalsy()
  })
})
