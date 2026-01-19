import bayernConfig from '../../../project-configs/bayern/config'
import * as downloadDataUri from '../../../util/downloadDataUri'
import {
  mockApplicationBlue,
  mockApplicationGold,
  mockApplicationWithoutAddress,
  mockApplicationWithoutApplicationDetails,
  mockApplicationWithoutPersonalData,
} from '../__mocks__/applicationData'
import { ApplicationDataIncompleteError } from './applicationDataHelper'
import { ApplicationToCsvError, exportApplicationToCsv } from './exportApplicationToCsv'

jest.mock('csv-stringify/browser/esm/sync', () => ({
  stringify: (input: string[][]) => input[0].join(','),
}))
jest.mock('../../../util/downloadDataUri')

describe('exportApplicationToCsv', () => {
  const TEST_BLOB_CONSTRUCTOR = jest.fn()
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully export application data to CSV with correct filename', () => {
    const downloadSpy = jest.spyOn(downloadDataUri, 'default')

    exportApplicationToCsv(mockApplicationBlue, bayernConfig)

    expect(downloadSpy).toHaveBeenCalled()
    expect(downloadSpy.mock.calls[0][1]).toBe('Doe_John_21.05.2025, 09:57.csv')
  })

  it('should throw error when CSV export is disabled', () => {
    const configWithoutExport = {
      ...bayernConfig,
      applicationFeature: {
        csvExport: false,
        applicationJsonToPersonalData: jest.fn(),
        applicationJsonToCardQuery: jest.fn(),
        applicationUsableWithApiToken: false,
      },
    }

    expect(() => exportApplicationToCsv(mockApplicationBlue, configWithoutExport)).toThrow(
      new ApplicationToCsvError('Es ist ein Fehler beim Export des Antrags aufgetreten.'),
    )
  })

  it('should throw error when address data is missing in application', () => {
    expect(() => exportApplicationToCsv(mockApplicationWithoutAddress, bayernConfig)).toThrow(
      new ApplicationDataIncompleteError(
        'Erforderliche Antragsdaten fehlen oder sind unvollständig.',
      ),
    )
  })

  it('should throw error when personal data is missing in application', () => {
    expect(() => exportApplicationToCsv(mockApplicationWithoutPersonalData, bayernConfig)).toThrow(
      new ApplicationDataIncompleteError(
        'Erforderliche Antragsdaten fehlen oder sind unvollständig.',
      ),
    )
  })

  it('should throw error when application details are missing in application', () => {
    expect(() =>
      exportApplicationToCsv(mockApplicationWithoutApplicationDetails, bayernConfig),
    ).toThrow(
      new ApplicationDataIncompleteError(
        'Erforderliche Antragsdaten fehlen oder sind unvollständig.',
      ),
    )
  })

  it('should create CSV with correct mime type', () => {
    const downloadSpy = jest.spyOn(downloadDataUri, 'default')

    exportApplicationToCsv(mockApplicationBlue, bayernConfig)

    const blobData = downloadSpy.mock.calls[0][0]
    expect(blobData).toBeInstanceOf(Blob)
    expect(blobData.type).toBe('text/csv;charset=utf-8;')
  })

  it('should create a correct csv blob with headline and content for blue card application', async () => {
    jest
      .spyOn(global, 'Blob')
      .mockImplementationOnce(
        (blobParts?: BlobPart[] | undefined, options?: BlobPropertyBag | undefined): Blob =>
          TEST_BLOB_CONSTRUCTOR(blobParts, options),
      )

    exportApplicationToCsv(mockApplicationBlue, bayernConfig)
    expect(TEST_BLOB_CONSTRUCTOR).toHaveBeenCalledWith(
      [
        'Vorname(n),Nachname,E-Mail-Adresse,Geburtsdatum,Telefonnummer,Straße,Adresszusatz,Hausnummer,Postleitzahl,Ort,Antrag auf,Antragsstellung' +
          'John,Doe,john.doe@gmail.com,04.02.2000,01722222222,Musterstraße,EG links,22,86152,Augsburg,Blaue Ehrenamtskarte,21.05.2025, 09:57',
      ],
      {
        type: 'text/csv;charset=utf-8;',
      },
    )
  })

  it('should create a correct csv blob with headline and content for gold card application', async () => {
    jest
      .spyOn(global, 'Blob')
      .mockImplementationOnce(
        (blobParts?: BlobPart[] | undefined, options?: BlobPropertyBag | undefined): Blob =>
          TEST_BLOB_CONSTRUCTOR(blobParts, options),
      )

    exportApplicationToCsv(mockApplicationGold, bayernConfig)
    expect(TEST_BLOB_CONSTRUCTOR).toHaveBeenCalledWith(
      [
        'Vorname(n),Nachname,E-Mail-Adresse,Geburtsdatum,Telefonnummer,Straße,Adresszusatz,Hausnummer,Postleitzahl,Ort,Antrag auf,Antragsstellung' +
          'John,Doe,john.doe@gmail.com,04.02.2000,01722222222,Musterstraße,EG links,22,86152,Augsburg,Goldene Ehrenamtskarte,21.05.2025, 09:57',
      ],
      {
        type: 'text/csv;charset=utf-8;',
      },
    )
  })
})
