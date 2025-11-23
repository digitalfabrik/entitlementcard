import { fireEvent, waitFor } from '@testing-library/react'
import { parse } from 'csv-parse/browser/esm/sync'
import { mocked } from 'jest-mock'

import nuernbergConfig from '../../../project-configs/nuernberg/config'
import { CustomRenderOptions, renderWithOptions } from '../../../testing/render'
import StoresCSVInput from '../StoresCSVInput'
import StoresImportDuplicates from '../StoresImportDuplicates'
import { DEFAULT_ERROR_TIMEOUT } from '../constants'

// TODO #1575 Remove mock values when jest can handle ECMA modules (#1574)

const fieldNames = nuernbergConfig.storesManagement.enabled
  ? nuernbergConfig.storesManagement.fields.map(field => field.name)
  : []
jest.mock('csv-parse/browser/esm/sync', () => ({
  parse: jest.fn(),
}))

const enqueueSnackbarMock = jest.fn()
jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: enqueueSnackbarMock,
  }),
}))

const mockProvider: CustomRenderOptions = {
  snackbar: true,
  translation: true,
}

const setAcceptingStores = jest.fn()
const setIsLoadingCoordinates = jest.fn()

describe('StoresCSVInput', () => {
  beforeEach(jest.resetAllMocks)
  const renderAndSubmitStoreInput = async (csv: string) => {
    const fileReaderMock = {
      // eslint-disable-next-line func-names
      readAsText: jest.fn(function (this: FileReader, _: Blob) {
        this.onloadend!({ target: { result: csv } } as ProgressEvent<FileReader>)
      }),
    } as unknown as FileReader
    jest.spyOn(global, 'FileReader').mockReturnValue(fileReaderMock)
    const file = new File([csv], 'Stores.csv', { type: 'text/csv' })
    const fields = nuernbergConfig.storesManagement.enabled ? nuernbergConfig.storesManagement.fields : []
    const { getByTestId } = renderWithOptions(
      <StoresCSVInput
        setAcceptingStores={setAcceptingStores}
        fields={fields}
        setIsLoadingCoordinates={setIsLoadingCoordinates}
      />,
      mockProvider
    )

    const fileInput = getByTestId('store-file-upload') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [file] } })
    fireEvent.input(fileInput)

    await waitFor(() => expect(fileReaderMock.readAsText).toHaveBeenCalledTimes(1))
  }

  it(`should correctly import csv store`, async () => {
    const csv = ''
    mocked(parse).mockReturnValueOnce([
      fieldNames,
      [
        'Test store',
        'Teststr.',
        '10',
        '90408',
        'Nürnberg',
        '12.700',
        '11.0765467',
        '0911/123456',
        'info@test.de',
        'https://www.test.de/kontakt/',
        '20% Ermäßigung für Erwachsene',
        '20% discount for adults',
        '17',
      ],
    ])

    await waitFor(async () => renderAndSubmitStoreInput(csv))
    expect(enqueueSnackbarMock).not.toHaveBeenCalled()
    expect(setAcceptingStores).toHaveBeenCalledTimes(1)
  })

  it(`should fail with error if empty csv is provided`, async () => {
    const error = 'Die gewählte Datei ist leer.'
    const csv = ''
    mocked(parse).mockReturnValueOnce([])
    await waitFor(async () => renderAndSubmitStoreInput(csv))
    expect(enqueueSnackbarMock).toHaveBeenCalledWith(error, {
      variant: 'error',
      autoHideDuration: DEFAULT_ERROR_TIMEOUT,
      persist: false,
    })
    expect(setAcceptingStores).not.toHaveBeenCalled()
  })

  it(`should fail if no store entry is provided`, async () => {
    const error = 'Die Datei muss mindestens einen Eintrag enthalten.'
    const csv = ''
    mocked(parse).mockReturnValueOnce([fieldNames])
    await waitFor(async () => renderAndSubmitStoreInput(csv))
    expect(enqueueSnackbarMock).toHaveBeenCalledWith(error, {
      variant: 'error',
      autoHideDuration: DEFAULT_ERROR_TIMEOUT,
      persist: false,
    })
    expect(setAcceptingStores).not.toHaveBeenCalled()
  })

  it(`should fail if the column format is not correct`, async () => {
    const error = 'Die erforderlichen Spalten sind nicht vorhanden oder nicht in der richtigen Reihenfolge.'
    const csv = ''
    mocked(parse).mockReturnValueOnce([
      [
        'name',
        'street',
        'categoryId',
        'lat',
        'long',
        'customColumn',
        'random',
        'houseNr',
        'discount',
        'test',
        'test2',
        'test3',
        'test4',
      ],
      [
        'Test store',
        'Teststr.',
        '10',
        '90408',
        'Nürnberg',
        '12.700',
        '11.0765467',
        '0911/123456',
        'info@test.de',
        'https://www.test.de/kontakt/',
        '20% Ermäßigung für Erwachsene',
        '20% discount for adults',
        '17',
      ],
    ])
    await waitFor(async () => renderAndSubmitStoreInput(csv))
    expect(enqueueSnackbarMock).toHaveBeenCalledWith(error, {
      variant: 'error',
      autoHideDuration: DEFAULT_ERROR_TIMEOUT,
      persist: false,
    })
    expect(setAcceptingStores).not.toHaveBeenCalled()
  })

  it(`should fail if the column amount is not correct`, async () => {
    const error = `Die CSV enthält eine ungültige Anzahl an Spalten.`
    const csv = ''
    mocked(parse).mockReturnValueOnce([
      [
        'name',
        'street',
        'houseNr',
        'postalCode',
        'location',
        'latitude',
        'longitude',
        'telephone',
        'email',
        'homepage',
        'discountDE',
        'discountEN',
        'categoryId',
        'test3',
      ],
      [
        'Test store',
        'Teststr.',
        '10',
        '90408',
        'Nürnberg',
        '12.700',
        '11.0765467',
        '0911/123456',
        'info@test.de',
        'https://www.test.de/kontakt/',
        '20% Ermäßigung für Erwachsene',
        '20% discount for adults',
        '17',
        'test',
      ],
    ])
    await waitFor(async () => renderAndSubmitStoreInput(csv))
    expect(enqueueSnackbarMock).toHaveBeenCalledWith(error, {
      variant: 'error',
      autoHideDuration: DEFAULT_ERROR_TIMEOUT,
      persist: false,
    })
    expect(setAcceptingStores).not.toHaveBeenCalled()
  })

  it(`should fail if the csv includes duplicated stores`, async () => {
    const error = <StoresImportDuplicates entries={[[1, 2]]} />
    const csv = ''
    mocked(parse).mockReturnValueOnce([
      fieldNames,
      [
        'Test store',
        'Teststr.',
        '10',
        '90408',
        'Nürnberg',
        '12.700',
        '11.0765467',
        '0911/123456',
        'info@test.de',
        'https://www.test.de/kontakt/',
        '20% Ermäßigung für Erwachsene',
        '20% discount for adults',
        '17',
      ],
      [
        'Test store',
        'Teststr.',
        '10',
        '90408',
        'Nürnberg',
        '12.700',
        '11.0765467',
        '0911/123456',
        'info@test.de',
        'https://www.test.de/kontakt/',
        '20% Ermäßigung für Erwachsene',
        '20% discount for adults',
        '17',
      ],
    ])
    await waitFor(async () => renderAndSubmitStoreInput(csv))
    expect(enqueueSnackbarMock).toHaveBeenCalledWith(error, { variant: 'error', autoHideDuration: 0, persist: true })
    expect(setAcceptingStores).not.toHaveBeenCalled()
  })
})
