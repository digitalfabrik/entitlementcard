import React from 'react'

import { renderWithOptions } from '../../../../testing/render'
import StoresImportResult from '../components/StoresImportResult'

describe('StoresImportResult', () => {
  it('should show the correct amount of stores that were affected', () => {
    const { getByTestId } = renderWithOptions(
      <StoresImportResult
        dryRun={false}
        storesUntouched={5}
        storesCreated={15}
        storesDeleted={20}
      />,
      { translation: true },
    )
    expect(getByTestId('storesUntouched').textContent).toBe('5')
    expect(getByTestId('storesCreated').textContent).toBe('15')
    expect(getByTestId('storesDeleted').textContent).toBe('20')
  })

  it('should show the correct headline for test import', () => {
    const { getByTestId } = renderWithOptions(
      <StoresImportResult
        dryRun={false}
        storesUntouched={5}
        storesCreated={15}
        storesDeleted={20}
      />,
      { translation: true },
    )
    expect(getByTestId('import-result-headline').textContent).toBe(
      'Der Import der Akzeptanzpartner war erfolgreich!',
    )
  })

  it('should show the correct headline for production import', () => {
    const { getByTestId } = renderWithOptions(
      <StoresImportResult dryRun storesUntouched={5} storesCreated={15} storesDeleted={20} />,
      { translation: true },
    )
    expect(getByTestId('import-result-headline').textContent).toBe(
      'Der Testimport der Akzeptanzpartner war erfolgreich!',
    )
  })
})
