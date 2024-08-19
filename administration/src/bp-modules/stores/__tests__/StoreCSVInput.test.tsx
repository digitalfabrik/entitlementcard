import { OverlayToaster } from '@blueprintjs/core'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { parse } from 'csv-parse/browser/esm/sync'
import { mocked } from 'jest-mock'
import React, { ReactElement } from 'react'

import { ProjectConfigProvider } from '../../../project-configs/ProjectConfigContext'
import nuernbergConfig from '../../../project-configs/nuernberg/config'
import { AppToasterProvider } from '../../AppToaster'
import StoresCSVInput from '../StoresCSVInput'

// TODO #1575 Remove mock values when jest can handle ECMA modules (#1574)
jest.mock('csv-stringify/browser/esm/sync', () => ({
  stringify: jest.fn(),
}))

const fieldNames = nuernbergConfig.storeManagement.enabled
  ? nuernbergConfig.storeManagement.fields.map(field => field.name)
  : []
jest.mock('csv-parse/browser/esm/sync', () => ({
  parse: jest.fn(),
}))
const wrapper = ({ children }: { children: ReactElement }) => (
  <AppToasterProvider>
    <ProjectConfigProvider>{children}</ProjectConfigProvider>
  </AppToasterProvider>
)
const setAcceptingStores = jest.fn()
describe('StoreCSVInput', () => {
  const renderAndSubmitStoreInput = async (csv: string) => {
    const fileReaderMock = {
      readAsText: jest.fn(function (this: FileReader, _: Blob) {
        this.onloadend!({ target: { result: csv } } as ProgressEvent<FileReader>)
      }),
    } as unknown as FileReader
    jest.spyOn(global, 'FileReader').mockReturnValue(fileReaderMock)
    const file = new File([csv], 'Stores.csv', { type: 'text/csv' })
    const fields = nuernbergConfig.storeManagement.enabled ? nuernbergConfig.storeManagement.fields : []
    const { getByTestId } = render(<StoresCSVInput setAcceptingStores={setAcceptingStores} fields={fields} />, {
      wrapper,
    })

    const fileInput = getByTestId('store-file-upload') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [file] } })
    fireEvent.input(fileInput)

    await waitFor(() => expect(fileReaderMock.readAsText).toHaveBeenCalledTimes(1))
  }

  it(`should correctly import csv store`, async () => {
    const csv = ''
    const toaster = jest.spyOn(OverlayToaster.prototype, 'show')
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

    await waitFor(async () => await renderAndSubmitStoreInput(csv))
    expect(toaster).not.toHaveBeenCalled()
    expect(setAcceptingStores).toHaveBeenCalledTimes(1)
  })

  it(`should fail with error if empty csv is provided`, async () => {
    const error = 'Die gewählte Datei ist leer.'
    const csv = ''
    const toaster = jest.spyOn(OverlayToaster.prototype, 'show')
    mocked(parse).mockReturnValueOnce([])
    await waitFor(async () => await renderAndSubmitStoreInput(csv))
    expect(toaster).toHaveBeenCalledWith({ intent: 'danger', message: error })
    expect(setAcceptingStores).not.toHaveBeenCalled()
  })

  it(`should fail if no store entry is provided`, async () => {
    const error = 'Die Datei muss mindestens einen Eintrag enthalten.'
    const csv = ''
    const toaster = jest.spyOn(OverlayToaster.prototype, 'show')
    mocked(parse).mockReturnValueOnce([fieldNames])
    await waitFor(async () => await renderAndSubmitStoreInput(csv))
    expect(toaster).toHaveBeenCalledWith({ intent: 'danger', message: error })
    expect(setAcceptingStores).not.toHaveBeenCalled()
  })

  it(`should fail if rows contain different amount of columns`, async () => {
    const error = 'Keine gültige CSV Datei. Nicht jede Reihe enthält gleich viele Elemente.'
    const csv = ''
    const toaster = jest.spyOn(OverlayToaster.prototype, 'show')
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
        'Test store2',
        'Teststr.',
        '12',
        '90408',
        'Nürnberg',
        '12.100',
        '11.365467',
        '0911/87654',
        'info@test.de',
        'https://www.test2.de/kontakt/',
        '20% Ermäßigung für Erwachsene',
        '20% discount for adults',
      ],
    ])
    await waitFor(async () => await renderAndSubmitStoreInput(csv))
    expect(toaster).toHaveBeenCalledWith({ intent: 'danger', message: error })
    expect(setAcceptingStores).not.toHaveBeenCalled()
  })

  it(`should fail if the column format is not correct`, async () => {
    const error = 'Das Spaltenformat ist nicht korrekt.'
    const csv = ''
    const toaster = jest.spyOn(OverlayToaster.prototype, 'show')
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
    await waitFor(async () => await renderAndSubmitStoreInput(csv))
    expect(toaster).toHaveBeenCalledWith({ intent: 'danger', message: error })
    expect(setAcceptingStores).not.toHaveBeenCalled()
  })
})
