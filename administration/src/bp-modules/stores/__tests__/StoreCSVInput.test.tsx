import { OverlayToaster } from '@blueprintjs/core'
import { fireEvent, render, waitFor } from '@testing-library/react'
import React, { ReactElement } from 'react'

import { ProjectConfigProvider } from '../../../project-configs/ProjectConfigContext'
import nuernbergConfig from '../../../project-configs/nuernberg/config'
import { AppToasterProvider } from '../../AppToaster'
import StoresCSVInput from '../StoresCSVInput'

// TODO #1574 Enable ECMA Modules for jest, to be able to test the csv-parse library. Currently the return values are mocked
jest.mock('csv-stringify/browser/esm/sync', () => ({
  stringify: jest.fn(),
}))

const fieldNames = nuernbergConfig.storeManagement.enabled
  ? nuernbergConfig.storeManagement.fields.map(field => field.name)
  : []
jest.mock('csv-parse/browser/esm/sync', () => ({
  parse: () => [
    fieldNames,
    [
      'Académie de Ballett et Danse',
      'Meuschelstr.',
      '10',
      '90408',
      'Nürnberg',
      '49.4622598',
      '11.0765467',
      '0911/9944884',
      'info@academie-ballettschule-uliczay.de',
      'https://www.academie-ballettschule-uliczay.de/kontakt/',
      '20% Ermäßigung für Erwachsene',
      '20% discount for adults',
      '17',
    ],
  ],
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

  it(`Correctly import CSV Store`, async () => {
    const csv = `
name,street,houseNumber,postalCode,location,latitude,longitude,telephone,email,homepage,discountDE,discountEN,categoryId
Académie de Ballett et Danse,Meuschelstr.,10,90408,Nürnberg,49.4622598,11.0765467,0911/9944884,info@academie-ballettschule-uliczay.de,https://www.academie-ballettschule-uliczay.de/kontakt/,20% Ermäßigung für Erwachsene,20% discount for adults,17
`
    const toaster = jest.spyOn(OverlayToaster.prototype, 'show')
    await waitFor(async () => await renderAndSubmitStoreInput(csv))
    expect(toaster).not.toHaveBeenCalled()
    expect(setAcceptingStores).toHaveBeenCalledTimes(1)
  })
})
