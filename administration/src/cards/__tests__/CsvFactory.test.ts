import { DynamicActivationCode } from '../../generated/card_pb'
import bayernConfig from '../../project-configs/bayern/config'
import nuernbergConfig from '../../project-configs/nuernberg/config'
import CardBlueprint from '../CardBlueprint'
import { CsvError, generateCsv, getCSVFilename } from '../CsvFactory'
import { CreateCardsResult } from '../createCards'
import NuernbergPassIdExtension from '../extensions/NuernbergPassIdExtension'
import { findExtension } from '../extensions/extensions'

jest.mock('csv-stringify/browser/esm/sync', () => ({
  stringify: (input: string[][]) => input[0].join(','),
}))

jest.mock('../../project-configs/showcase/config')

const TEST_BLOB_CONSTRUCTOR = jest.fn()

describe('CsvFactory', () => {
  it('should use pass id for single cards export', () => {
    const testPassId = '86152'
    const cards = [new CardBlueprint('Thea Test', nuernbergConfig.card)]
    const passIdExtenstion = findExtension(cards[0].extensions, NuernbergPassIdExtension) // cards[0].extensions.find(ext => ext instanceof NuernbergPassIdExtension)
    if (!passIdExtenstion) {
      throw Error('test failed')
    }
    passIdExtenstion.fromString(testPassId)
    const filename = getCSVFilename(cards)
    expect(filename).toBe(`${testPassId}.csv`)
  })

  it('should use bulkname for multiple cards export', () => {
    const cards = [
      new CardBlueprint('Thea Test', nuernbergConfig.card),
      new CardBlueprint('Theo Test', nuernbergConfig.card),
    ]
    const filename = getCSVFilename(cards)
    expect(filename).toBe('Pass-ID[0]mass.csv')
  })

  it('should throw error if csv export is disabled', () => {
    const cards = [new CardBlueprint('Thea Test', nuernbergConfig.card)]

    const codes: CreateCardsResult[] = [
      {
        dynamicCardInfoHashBase64: 'rS8nukf7S9j8V1j+PZEkBQWlAeM2WUKkmxBHi1k9hRo=',
        dynamicActivationCode: new DynamicActivationCode({ info: cards[0].generateCardInfo() }),
      },
    ]

    expect(() => generateCsv(codes, cards, bayernConfig.csvExport)).toThrow(
      new CsvError('CSV Export is disabled for this project')
    )
  })

  it('should return only header csv for empty input', async () => {
    jest
      .spyOn(global, 'Blob')
      .mockImplementationOnce(
        (blobParts?: BlobPart[] | undefined, options?: BlobPropertyBag | undefined): Blob =>
          TEST_BLOB_CONSTRUCTOR(blobParts, options)
      )

    if (!nuernbergConfig.csvExport.enabled) {
      throw Error('test failed')
    }
    generateCsv([], [], nuernbergConfig.csvExport)
    expect(TEST_BLOB_CONSTRUCTOR).toHaveBeenCalledWith([nuernbergConfig.csvExport.csvHeader.join(',')], {
      type: 'text/csv;charset=utf-8;',
    })
  })
})
