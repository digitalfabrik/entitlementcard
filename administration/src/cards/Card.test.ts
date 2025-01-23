import { BavariaCardType } from '../generated/card_pb'
import { Region } from '../generated/graphql'
import PlainDate from '../util/PlainDate'
import {
  MAX_NAME_LENGTH,
  generateCardInfo,
  getValueByCSVHeader,
  initializeCard,
  initializeCardFromCSV,
  isValid,
  isValueValid,
} from './Card'
import BavariaCardTypeExtension, { BAVARIA_CARD_TYPE_EXTENSION_NAME } from './extensions/BavariaCardTypeExtension'
import BirthdayExtension, { BIRTHDAY_EXTENSION_NAME } from './extensions/BirthdayExtension'
import KoblenzReferenceNumberExtension, {
  KOBLENZ_REFERENCE_NUMBER_EXTENSION_NAME,
} from './extensions/KoblenzReferenceNumberExtension'
import RegionExtension, { REGION_EXTENSION_NAME } from './extensions/RegionExtension'

jest.useFakeTimers({ now: new Date('2020-01-01') })

describe('Card', () => {
  const region: Region = {
    id: 6,
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

  it('should correctly initialize Card', () => {
    const card = initializeCard(cardConfig, region, { fullName: 'Thea Test' })

    expect(card.fullName).toBe('Thea Test')
    expect(card.expirationDate).toEqual(PlainDate.from('2023-01-01'))
    expect(card.extensions[BAVARIA_CARD_TYPE_EXTENSION_NAME]).toBe('Standard')
    expect(card.extensions[REGION_EXTENSION_NAME]).toEqual(region.id)
  })

  it('should generate CardInfo even with invalid expiration date', () => {
    const card = initializeCard(cardConfig, region, {
      fullName: '',
      expirationDate: PlainDate.from('1900-01-01'),
    })
    expect(generateCardInfo(card).toJson({ enumAsInteger: true })).toEqual({
      fullName: '',
      expirationDay: 0,
      extensions: {
        extensionRegion: {
          regionId: region.id,
        },
        extensionBavariaCardType: {
          cardType: BavariaCardType.STANDARD,
        },
      },
    })
  })

  describe('csv', () => {
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
      const date = PlainDate.fromCustomFormat(dateString)
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
      expect(getValueByCSVHeader(card, cardConfig, 'Ablaufdatum')).toBe(date.format())
      expect(getValueByCSVHeader(card, cardConfig, 'Kartentyp')).toBe('Goldkarte')
    })

    it('should not modify value for invalid header', () => {
      const line = ['1']
      const headers = ['Region']
      const card = initializeCardFromCSV(cardConfig, line, headers, region)

      expect(card.fullName).toBe('')

      expect(getValueByCSVHeader(card, cardConfig, 'Region')).toBeUndefined()
    })

    it('should correctly identify invalid values', () => {
      const line = ['2012/03/02', 'Graublau']
      const headers = ['Ablaufdatum', 'Kartentyp']
      const card = initializeCardFromCSV(cardConfig, line, headers, region)

      expect(card.fullName).toBe('')
      expect(getValueByCSVHeader(card, cardConfig, 'Name')).toBe('')
      expect(card.expirationDate).toBeNull()
      expect(getValueByCSVHeader(card, cardConfig, 'Ablaufdatum')).toBeUndefined()
      expect(card.extensions[BAVARIA_CARD_TYPE_EXTENSION_NAME]).toBeUndefined()
      expect(getValueByCSVHeader(card, cardConfig, 'Kartentyp')).toBeUndefined()

      expect(isValueValid(card, cardConfig, 'Name')).toBeFalsy()
      expect(isValueValid(card, cardConfig, 'Ablaufdatum')).toBeFalsy()
      expect(isValueValid(card, cardConfig, 'Kartentyp')).toBeFalsy()
      expect(isValid(card)).toBeFalsy()
    })
  })

  it.each(['$tefan Mayer', 'Karla Karls😀', 'إئبآء؟ؤئحجرزش'])(
    'should correctly identify invalid special characters in fullname',
    fullName => {
      const card = initializeCard(cardConfig, region, { fullName })
      expect(card.fullName).toBe(fullName)
      expect(isValueValid(card, cardConfig, 'Name')).toBeFalsy()
      expect(isValid(card)).toBeFalsy()
    }
  )

  it.each(['Dr. Karl Lauterbach', " Mac O'Connor", 'Hans-Wilhelm Müller-Wohlfahrt'])(
    'should correctly create a cards that contain some certain special characters in the name',
    fullName => {
      const card = initializeCard(cardConfig, region, { fullName })
      expect(card.fullName).toBe(fullName)
      expect(isValueValid(card, cardConfig, 'Name')).toBeTruthy()
      expect(isValid(card)).toBeTruthy()
    }
  )

  it.each([' Karla Koblenz', ' Karla Karl', ' Karla Karls '])(
    'should correctly create a card even with whitespace in the beginning and end',
    fullName => {
      const card = initializeCard(cardConfig, region, { fullName })
      expect(card.fullName).toBe(fullName)
      expect(isValueValid(card, cardConfig, 'Name')).toBeTruthy()
      expect(isValid(card)).toBeTruthy()
    }
  )

  it.each(['Karla', 'Peter'])('should correctly identify invalid fullname that is incomplete', fullName => {
    const card = initializeCard(cardConfig, region, { fullName })
    expect(isValueValid(card, cardConfig, 'Name')).toBeFalsy()
    expect(isValid(card)).toBeFalsy()
  })

  it(`should correctly identify invalid fullname that exceeds max length (${MAX_NAME_LENGTH} characters)`, () => {
    const card = initializeCard(cardConfig, region, { fullName: 'Karl LauterLauterLauterLauterLauterLauterLauterbach' })
    expect(isValueValid(card, cardConfig, 'Name')).toBeFalsy()
    expect(isValid(card)).toBeFalsy()
  })

  describe('self service', () => {
    const cardConfig = {
      defaultValidity: { years: 3 },
      nameColumnName: 'Name',
      expiryColumnName: 'Ablaufdatum',
      extensionColumnNames: ['Geburtsdatum', 'Referenznummer'],
      extensions: [BirthdayExtension, KoblenzReferenceNumberExtension],
    }
    const expirationDate = PlainDate.fromLocalDate(new Date()).add(cardConfig.defaultValidity)

    it('should correctly initialize Card', () => {
      const card = initializeCard(cardConfig, undefined, { fullName: 'Karla Koblenz' })

      expect(card.fullName).toBe('Karla Koblenz')
      expect(card.expirationDate).toEqual(expirationDate)
      expect(card.extensions[BIRTHDAY_EXTENSION_NAME]).toBe(BirthdayExtension.getInitialState().birthday)
      expect(card.extensions[KOBLENZ_REFERENCE_NUMBER_EXTENSION_NAME]).toBe(
        KoblenzReferenceNumberExtension.getInitialState().koblenzReferenceNumber
      )
    })

    it('should generate CardInfo', () => {
      const card = initializeCard(cardConfig, undefined, { fullName: 'Karla Koblenz' })
      expect(generateCardInfo(card).toJson()).toEqual({
        fullName: 'Karla Koblenz',
        expirationDay: expirationDate.toDaysSinceEpoch(),
        extensions: {
          extensionBirthday: {},
          extensionKoblenzReferenceNumber: {
            referenceNumber: '',
          },
        },
      })
    })
  })
})
