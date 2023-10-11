import {
  BavariaCardType,
  BavariaCardTypeExtension,
  BirthdayExtension,
  CardExtensions,
  CardInfo,
  NuernbergPassIdExtension,
  RegionExtension,
  StartDayExtension,
} from '../generated/card_pb'
import { base64ToUint8Array, uint8ArrayToBase64 } from '../util/base64'
import hashCardInfo, { messageToJsonObject } from './hashCardInfo'

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
        extensionNuernbergPassId: new NuernbergPassIdExtension({
          passId: 99999999,
        }),
        extensionRegion: new RegionExtension({
          regionId: 93,
        }),
      }),
    })

    expect(messageToJsonObject(cardInfo)).toEqual({
      '1': 'Max Mustermann',
      '2': '14600',
      '3': {
        '1': { '1': '93' }, // extensionRegion
        '2': { '1': '-3650' }, // extensionBirthday
        '3': { '1': '99999999' }, // extensionNuernbergPassId
      },
    })
  })

  it('should map a cardInfo for a Nuernberg Pass with startDay correctly', () => {
    const cardInfo = new CardInfo({
      fullName: 'Max Mustermann',
      expirationDay: 365 * 40, // Equals 14.600
      extensions: new CardExtensions({
        extensionBirthday: new BirthdayExtension({
          birthday: -365 * 10,
        }),
        extensionNuernbergPassId: new NuernbergPassIdExtension({
          passId: 99999999,
        }),
        extensionRegion: new RegionExtension({
          regionId: 93,
        }),
        extensionStartDay: new StartDayExtension({ startDay: 365 * 2 }),
      }),
    })

    expect(messageToJsonObject(cardInfo)).toEqual({
      '1': 'Max Mustermann',
      '2': '14600',
      '3': {
        '1': { '1': '93' }, // extensionRegion
        '2': { '1': '-3650' }, // extensionBirthday
        '3': { '1': '99999999' }, // extensionNuernbergPassId
        '5': { '1': '730' }, // extensionStartDay
      },
    })
  })
})

describe('hashCardInfo', () => {
  // Equivalent tests exist in frontend to ensure that the algorithms produce the same hashes.

  it('should be stable for a Bavarian Blue EAK', async () => {
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
    const pepper = base64ToUint8Array('MvMjEqa0ulFDAgACElMjWA==')
    const hash = await hashCardInfo(cardInfo, pepper)

    expect(uint8ArrayToBase64(hash)).toBe('rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=')
  })

  it('should be stable for a Bavarian Golden EAK', async () => {
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
    const pepper = base64ToUint8Array('MvMjEqa0ulFDAgACElMjWA==')
    const hash = await hashCardInfo(cardInfo, pepper)

    expect(uint8ArrayToBase64(hash)).toBe('ZZTYNcFwEoAT7Z2ylesSn3oF7OInshUqWbZpP3zZcDw=')
  })

  it('should be stable for a Nuernberg Pass', async () => {
    const cardInfo = new CardInfo({
      fullName: 'Max Mustermann',
      expirationDay: 365 * 40, // Equals 14.600
      extensions: new CardExtensions({
        extensionRegion: new RegionExtension({
          regionId: 93,
        }),
        extensionBirthday: new BirthdayExtension({
          birthday: -365 * 10,
        }),
        extensionNuernbergPassId: new NuernbergPassIdExtension({
          passId: 99999999,
        }),
      }),
    })
    const pepper = base64ToUint8Array('MvMjEqa0ulFDAgACElMjWA==')
    const hash = await hashCardInfo(cardInfo, pepper)

    expect(uint8ArrayToBase64(hash)).toBe('zogEJOhnSSp//8qhym/DdorQYgL/763Kfq4slWduxMg=')
  })

  it('should be stable for a Nuernberg Pass with startDay', async () => {
    const cardInfo = new CardInfo({
      fullName: 'Max Mustermann',
      expirationDay: 365 * 40, // Equals 14.600
      extensions: new CardExtensions({
        extensionRegion: new RegionExtension({
          regionId: 93,
        }),
        extensionBirthday: new BirthdayExtension({
          birthday: -365 * 10,
        }),
        extensionNuernbergPassId: new NuernbergPassIdExtension({
          passId: 99999999,
        }),
        extensionStartDay: new StartDayExtension({ startDay: 365 * 2 }),
      }),
    })
    const pepper = base64ToUint8Array('MvMjEqa0ulFDAgACElMjWA==')
    const hash = await hashCardInfo(cardInfo, pepper)

    expect(uint8ArrayToBase64(hash)).toBe('1ChHiAvWygwu+bH2yOZOk1zdmwTDZ4mkvu079cyuLjE=')
  })
})
