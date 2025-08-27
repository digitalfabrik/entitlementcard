import { generateCsv } from '../StoreCSVOutput'
import { validStoreDataForImport } from '../__mock__/mockStoreEntry'

jest.mock('csv-stringify/browser/esm/sync', () => ({
  stringify: (input: string[][]) => input[0].join(','),
}))

const TEST_BLOB_CONSTRUCTOR = jest.fn()
describe('StoreCSVOutput', () => {
  it('should create a correct csv blob', async () => {
    jest
      .spyOn(global, 'Blob')
      .mockImplementationOnce(
        (blobParts?: BlobPart[] | undefined, options?: BlobPropertyBag | undefined): Blob =>
          TEST_BLOB_CONSTRUCTOR(blobParts, options)
      )

    generateCsv([validStoreDataForImport])
    expect(TEST_BLOB_CONSTRUCTOR).toHaveBeenCalledWith(
      [
        'name,street,houseNumber,postalCode,location,latitude,longitude,telephone,email,homepage,discountDE,discountEN,categoryIdTestStpre,Meuschelstr.,10,90408,Nürnberg,49.4622598,49.4622598,0911/9944884,info@academie-ballettschule-uliczay.de,https://www.academie-ballettschule-uliczay.de/kontakt/,20% Ermäßigung für Erwachsene,20% discount for adults,15',
      ],
      {
        type: 'text/csv;charset=utf-8;',
      }
    )
  })
})
