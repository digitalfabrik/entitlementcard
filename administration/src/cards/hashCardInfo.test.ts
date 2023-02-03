import {
  BavariaCardType,
  BavariaCardTypeExtension,
  BirthdayExtension,
  CardExtensions,
  CardInfo,
  NuernbergPassNumberExtension,
  RegionExtension,
} from '../generated/card_pb'
import hashCardInfo, { messageToJsonObject } from './hashCardInfo'
import Uint8ArrayToBase64 from '../util/uint8ArrayToBase64'

describe('messageToJsonObject', () => {
  it('should map an empty cardInfo correctly', () => {
    const cardInfo = new CardInfo({})
    expect(messageToJsonObject(cardInfo)).toEqual({})
  })

  it('should map a cardInfo with fullName correctly', () => {
    const wildName = 'Biene Maja ßäЦЧШܐܳܠܰܦ'
    const cardInfo = new CardInfo({
      fullName: wildName,
    })
    expect(messageToJsonObject(cardInfo)).toEqual({ '1': wildName })
  })

  it('should map a cardInfo for a Bavarian Blue EAK correctly', () => {
    const cardInfo = new CardInfo({
      fullName: 'Max Mustermann',
      expirationDay: 365 * 40, // Equals 14.600
      extensions: new CardExtensions({
        extensionRegion: new RegionExtension({
          regionId: 16,
        }),
        extensionBavariaCardType: new BavariaCardTypeExtension({
          cardType: BavariaCardType.STANDARD,
        }),
      }),
    })
    expect(messageToJsonObject(cardInfo)).toEqual({
      '1': 'Max Mustermann',
      '2': '14600',
      '3': {
        '1': { '1': '16' }, // extensionRegion
        '4': { '1': '0' }, // extensionBavariaCardType
      },
    })
  })

  it('should map a cardInfo for a Bavarian Golden EAK correctly', () => {
    const cardInfo = new CardInfo({
      fullName: 'Max Mustermann',
      extensions: new CardExtensions({
        extensionRegion: new RegionExtension({
          regionId: 16,
        }),
        extensionBavariaCardType: new BavariaCardTypeExtension({
          cardType: BavariaCardType.GOLD,
        }),
      }),
    })
    expect(messageToJsonObject(cardInfo)).toEqual({
      '1': 'Max Mustermann',
      '3': {
        '1': { '1': '16' }, // extensionRegion
        '4': { '1': '1' }, // extensionBavariaCardType
      },
    })
  })

  it('should map a cardInfo for a Nuernberg Pass correctly', () => {
    const cardInfo = new CardInfo({
      fullName: 'Max Mustermann',
      expirationDay: 365 * 40, // Equals 14.600
      extensions: new CardExtensions({
        extensionBirthday: new BirthdayExtension({
          birthday: -365 * 10,
        }),
        extensionNuernbergPassNumber: new NuernbergPassNumberExtension({
          passNumber: 99999999,
        }),
      }),
    })
    expect(messageToJsonObject(cardInfo)).toEqual({
      '1': 'Max Mustermann',
      '2': '14600',
      '3': {
        '2': { '1': '-3650' }, // extensionBirthday
        '3': { '1': '99999999' }, // extensionNuernbergPassNumber
      },
    })
  })
})

describe('hashCardInfo', () => {
  it('should be stable for a Nuernberg Pass', async () => {
    const cardInfo = new CardInfo({
      fullName: 'Max Mustermann',
      expirationDay: 365 * 40, // Equals 14.600
      extensions: new CardExtensions({
        extensionBirthday: new BirthdayExtension({
          birthday: -365 * 10,
        }),
        extensionNuernbergPassNumber: new NuernbergPassNumberExtension({
          passNumber: 99999999,
        }),
      }),
    })
    const pepper = new Uint8Array([
      0x32, 0xf3, 0x23, 0x12, 0xa6, 0xb4, 0xba, 0x51, 0x43, 0x02, 0x00, 0x02, 0x12, 0x53, 0x23, 0x58,
    ])
    const hash = await hashCardInfo(pepper, cardInfo)
    expect(Uint8ArrayToBase64(hash)).toEqual('IgLffs+odapQKiGMnbS3ihcIabXRhtpW8TeWgtPHlF0=')
  })
})
