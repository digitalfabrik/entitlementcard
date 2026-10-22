import { beforeEach, describe, expect, it, vi } from 'vitest'

import { config } from '../../../project-configs/bayern/config'
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

vi.mock('csv-stringify/browser/esm/sync', () => ({
  stringify: (input: string[][]) => input[0].join(','),
}))
vi.mock('../../../util/downloadDataUri')

describe('exportApplicationToCsv', () => {
  const TEST_BLOB_CONSTRUCTOR = vi.fn()
  class TestBlob {
    constructor(blobParts?: BlobPart[] | undefined, options?: BlobPropertyBag | undefined) {
      TEST_BLOB_CONSTRUCTOR(blobParts, options)
    }
  }
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should successfully export application data to CSV with correct filename', () => {
    const downloadSpy = vi.spyOn(downloadDataUri, 'default')

    exportApplicationToCsv(mockApplicationBlue, config)

    expect(downloadSpy).toHaveBeenCalled()
    expect(downloadSpy.mock.calls[0][1]).toBe('Doe_John_15.05.2024, 09:20.csv')
  })

  it('should throw error when CSV export is disabled', () => {
    const configWithoutExport = {
      ...config,
      applicationFeature: {
        csvExport: false,
        applicationJsonToPersonalData: vi.fn(),
        applicationJsonToCardQuery: vi.fn(),
        applicationUsableWithApiToken: false,
      },
    }

    expect(() => exportApplicationToCsv(mockApplicationBlue, configWithoutExport)).toThrow(
      new ApplicationToCsvError('Es ist ein Fehler beim Export des Antrags aufgetreten.'),
    )
  })

  it('should throw error when address data is missing in application', () => {
    expect(() => exportApplicationToCsv(mockApplicationWithoutAddress, config)).toThrow(
      new ApplicationDataIncompleteError(
        'Erforderliche Antragsdaten fehlen oder sind unvollständig.',
      ),
    )
  })

  it('should throw error when personal data is missing in application', () => {
    expect(() => exportApplicationToCsv(mockApplicationWithoutPersonalData, config)).toThrow(
      new ApplicationDataIncompleteError(
        'Erforderliche Antragsdaten fehlen oder sind unvollständig.',
      ),
    )
  })

  it('should throw error when application details are missing in application', () => {
    expect(() => exportApplicationToCsv(mockApplicationWithoutApplicationDetails, config)).toThrow(
      new ApplicationDataIncompleteError(
        'Erforderliche Antragsdaten fehlen oder sind unvollständig.',
      ),
    )
  })

  it('should create CSV with correct mime type', () => {
    const downloadSpy = vi.spyOn(downloadDataUri, 'default')

    exportApplicationToCsv(mockApplicationBlue, config)

    const blobData = downloadSpy.mock.calls[0][0]
    expect(blobData).toBeInstanceOf(Blob)
    expect(blobData.type).toBe('text/csv;charset=utf-8;')
  })

  it('should create a correct csv blob with headline and content for blue card application', async () => {
    vi.spyOn(global, 'Blob').mockImplementationOnce(TestBlob as typeof Blob)

    exportApplicationToCsv(mockApplicationBlue, config)
    expect(TEST_BLOB_CONSTRUCTOR).toHaveBeenCalledWith(
      [
        'Vorname(n),Nachname,E-Mail-Adresse,Geburtsdatum,Telefonnummer,Straße,Adresszusatz,Hausnummer,Postleitzahl,Ort,Antrag auf,Antragsstellung' +
          'John,Doe,john.doe@gmail.com,04.02.2000,01722222222,Musterstraße,EG links,22,86152,Augsburg,Blaue Ehrenamtskarte,15.05.2024, 09:20',
      ],
      {
        type: 'text/csv;charset=utf-8;',
      },
    )
  })

  it('should create a correct csv blob with headline and content for gold card application', async () => {
    vi.spyOn(global, 'Blob').mockImplementationOnce(TestBlob as typeof Blob)

    exportApplicationToCsv(mockApplicationGold, config)
    expect(TEST_BLOB_CONSTRUCTOR).toHaveBeenCalledWith(
      [
        'Vorname(n),Nachname,E-Mail-Adresse,Geburtsdatum,Telefonnummer,Straße,Adresszusatz,Hausnummer,Postleitzahl,Ort,Antrag auf,Antragsstellung' +
          'John,Doe,john.doe@gmail.com,04.02.2000,01722222222,Musterstraße,EG links,22,86152,Augsburg,Goldene Ehrenamtskarte,15.05.2024, 09:20',
      ],
      {
        type: 'text/csv;charset=utf-8;',
      },
    )
  })
})
