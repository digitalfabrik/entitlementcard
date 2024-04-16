//import { stringify } from 'csv-stringify/browser/esm/sync'
import CardBlueprint from '../../../cards/CardBlueprint'
import { CreateCardsResult } from '../../../cards/createCards'
import { DynamicActivationCode, StaticVerificationCode } from '../../../generated/card_pb'
import { Region } from '../../../generated/graphql'
import getProjectConfig from '../../getProjectConfig'
import nuernbergConfig from '../config'
import config from '../config'
import { buildCsvLine } from '../csvExport'

jest.mock('csv-stringify', () => ({
  stringify: jest.fn(input => {
    console.log(input)
    return input[0].join(',')
  }),
}))

jest.mock('../../getProjectConfig')

describe('csvExport', () => {
  it('header should have same length as line', () => {
    const region: Region = {
      id: 0,
      name: 'augsburg',
      prefix: 'a',
      activatedForApplication: true,
    }

    const cards = [
      new CardBlueprint('Thea Test', nuernbergConfig.card, [region]),
      new CardBlueprint('Thea Test', nuernbergConfig.card, [region]),
    ]

    const codes: CreateCardsResult[] = [
      {
        dynamicCardInfoHashBase64: 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=',
        dynamicActivationCode: new DynamicActivationCode({ info: cards[0].generateCardInfo() }),
      },
      {
        dynamicCardInfoHashBase64: 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=',
        dynamicActivationCode: new DynamicActivationCode({ info: cards[1].generateCardInfo() }),
        staticCardInfoHashBase64: 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=',
        staticVerificationCode: new StaticVerificationCode({ info: cards[1].generateCardInfo() }),
      },
    ]

    const line = buildCsvLine(codes[0], cards[0])
    //console.log(line)
    const csvConfig = config.csvExport
    expect(csvConfig.enabled).toBeTruthy()
    if (csvConfig.enabled) {
      expect(line.split(',').length).toEqual(csvConfig.csvHeader.length)
    } else {
      expect(true).toBeFalsy()
    }
  })
})
