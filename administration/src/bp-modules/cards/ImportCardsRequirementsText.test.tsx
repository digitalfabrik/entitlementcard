import React from 'react'

import { renderWithTranslation } from '../../testing/render'
import ImportCardsRequirementsText from './ImportCardsRequirementsText'

describe('ImportCardsRequirementsText', () => {
  const csvHeaders = ['Name', 'Ablaufdatum', 'Kartentyp', 'Address']

  it('should show mandatory requirements with asterisks', () => {
    const { getByText } = renderWithTranslation(
      <ImportCardsRequirementsText csvHeaders={csvHeaders} isFreinetFormat={false} />
    )

    expect(getByText('Spaltenformat: Name*, Ablaufdatum*, Kartentyp*, Address')).toBeTruthy()
  })
})
