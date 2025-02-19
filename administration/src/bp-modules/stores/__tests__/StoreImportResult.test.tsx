import React from 'react'

import { renderWithTranslation } from '../../../testing/render'
import StoresImportResult from '../StoresImportResult'

describe('StoresImportResult', () => {
  it('should show the correct amount of stores that were affected', () => {
    const { getByTestId } = renderWithTranslation(
      <StoresImportResult dryRun={false} storesUntouched={5} storesCreated={15} storesDeleted={20} />
    )
    expect(getByTestId('storesUntouched').textContent).toBe('5')
    expect(getByTestId('storesCreated').textContent).toBe('15')
    expect(getByTestId('storesDeleted').textContent).toBe('20')
  })

  it('should show the correct headline for test import', () => {
    const { getByTestId } = renderWithTranslation(
      <StoresImportResult dryRun={false} storesUntouched={5} storesCreated={15} storesDeleted={20} />
    )
    expect(getByTestId('import-result-headline').textContent).toBe('Der Import der Akzeptanzpartner war erfolgreich!')
  })

  it('should show the correct headline for production import', () => {
    const { getByTestId } = renderWithTranslation(
      <StoresImportResult dryRun storesUntouched={5} storesCreated={15} storesDeleted={20} />
    )
    expect(getByTestId('import-result-headline').textContent).toBe(
      'Der Testimport der Akzeptanzpartner war erfolgreich!'
    )
  })
})
