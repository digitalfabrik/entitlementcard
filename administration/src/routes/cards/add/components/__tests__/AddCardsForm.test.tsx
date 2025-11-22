import { act, fireEvent } from '@testing-library/react'
import React from 'react'

import { initializeCardFromCSV } from '../../../../../cards/Card'
import { mockRegion } from '../../../../../cards/__mocks__/mockRegion'
import bayernConfig from '../../../../../project-configs/bayern/config'
import { CustomRenderOptions, renderWithOptions } from '../../../../../testing/render'
import AddCardsForm from '../AddCardsForm'

const mockBaseProvider: CustomRenderOptions = {
  translation: true,
  router: true,
}
describe('AddCardsForm', () => {
  const card = initializeCardFromCSV(bayernConfig.card, [], [], mockRegion)
  const defaultProps = {
    region: mockRegion,
    cards: [],
    setCards: jest.fn(),
    showAddMoreCardsButton: true,
    updateCard: jest.fn(),
  }

  it('should render add card button when showAddMoreCardsButton is true', () => {
    const { getByText } = renderWithOptions(<AddCardsForm {...defaultProps} />, mockBaseProvider)
    const addButton = getByText('Karte hinzufügen')
    expect(addButton).toBeTruthy()
  })

  it('should not render add card button when showAddMoreCardsButton is false', () => {
    const { queryByText } = renderWithOptions(
      <AddCardsForm {...defaultProps} showAddMoreCardsButton={false} />,
      mockBaseProvider
    )
    const addButton = queryByText('Karte hinzufügen')
    expect(addButton).toBeNull()
  })

  it('should add new card when clicking add button', () => {
    const { getByText } = renderWithOptions(<AddCardsForm {...defaultProps} />, mockBaseProvider)
    act(() => {
      fireEvent.click(getByText('Karte hinzufügen'))
    })
    expect(defaultProps.setCards).toHaveBeenCalled()
  })

  it('should remove card when clicking remove button', () => {
    const { getByTestId } = renderWithOptions(<AddCardsForm {...defaultProps} cards={[card]} />, {
      ...mockBaseProvider,
      localization: true,
    })
    act(() => {
      fireEvent.click(getByTestId('remove-card'))
    })
    expect(defaultProps.setCards).toHaveBeenCalledWith([])
  })
})
