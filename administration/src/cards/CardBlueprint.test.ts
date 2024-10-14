import { BavariaCardType } from '../generated/card_pb'
import { Region } from '../generated/graphql'
import PlainDate from '../util/PlainDate'
import { generateCardInfo, initializeCardBlueprint } from './CardBlueprint'
import BavariaCardTypeExtension, { BAVARIA_CARD_TYPE_EXTENSION_NAME } from './extensions/BavariaCardTypeExtension'
import RegionExtension, { REGION_EXTENSION_NAME } from './extensions/RegionExtension'

jest.useFakeTimers({ now: new Date('2020-01-01') })

describe('CardBlueprint', () => {
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

  it('should correctly initialize CardBlueprint', () => {
    const card = initializeCardBlueprint(cardConfig, region, { fullName: 'Thea Test' })

    expect(card.fullName).toBe('Thea Test')
    expect(card.expirationDate).toEqual(PlainDate.from('2023-01-01').toDaysSinceEpoch())
    expect(card.extensions[BAVARIA_CARD_TYPE_EXTENSION_NAME]).toBe('Standard')
    expect(card.extensions[REGION_EXTENSION_NAME]).toEqual(region.id)
  })

  it('should generate CardInfo even with invalid expiration date', () => {
    const card = initializeCardBlueprint(cardConfig, region, {
      fullName: '',
      expirationDate: PlainDate.from('1900-01-01').toDaysSinceEpoch(),
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
})
