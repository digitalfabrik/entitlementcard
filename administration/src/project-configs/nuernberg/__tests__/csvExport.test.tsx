import CardBlueprint from '../../../cards/CardBlueprint'
import { CreateCardsResult } from '../../../cards/createCards'
import { DynamicActivationCode } from '../../../generated/card_pb'
import nuernbergConfig from '../config'
import { buildCsvLine } from '../csvExport'

jest.mock('csv-stringify/browser/esm/sync', () => ({
  stringify: (input: string[][]) => input[0].join(','),
}))

jest.mock('../../getProjectConfig')

describe('csvExport', () => {
  it('header should have same length as line', () => {
    const cards = [new CardBlueprint('Thea Test', nuernbergConfig.card)]

    const codes: CreateCardsResult[] = [
      {
        dynamicCardInfoHashBase64: 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=',
        dynamicActivationCode: new DynamicActivationCode({ info: cards[0].generateCardInfo() }),
      },
    ]

    const csvConfig = nuernbergConfig.csvExport
    expect(csvConfig.enabled).toBeTruthy()
    if (!csvConfig.enabled) {
      throw new Error('Tested failed')
    }
    expect(buildCsvLine(codes[0], cards[0]).split(',')).toHaveLength(csvConfig.csvHeader.length)
  })
})
