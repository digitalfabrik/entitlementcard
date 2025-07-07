import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { act, fireEvent } from '@testing-library/react'
import React, { ReactNode } from 'react'

import { initializeCardFromCSV } from '../../../cards/Card'
import { mockRegion } from '../../../cards/__mocks__/mockRegion'
import bayernConfig from '../../../project-configs/bayern/config'
import { renderWithTranslation } from '../../../testing/render'
import AddCardsForm from '../AddCardsForm'

describe('AddCardsForm', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>{children}</LocalizationProvider>
  )
  const card = initializeCardFromCSV(bayernConfig.card, [], [], mockRegion)
  const defaultProps = {
    region: mockRegion,
    cards: [],
    setCards: jest.fn(),
    showAddMoreCardsButton: true,
    updateCard: jest.fn(),
  }

  it('should render add card button when showAddMoreCardsButton is true', () => {
    const { getByText } = renderWithTranslation(<AddCardsForm {...defaultProps} />)
    act(() => {
      const addButton = getByText('Karte hinzufügen')
      expect(addButton).toBeTruthy()
    })
  })

  it('should not render add card button when showAddMoreCardsButton is false', () => {
    const { queryByText } = renderWithTranslation(<AddCardsForm {...defaultProps} showAddMoreCardsButton={false} />)
    const addButton = queryByText('Karte hinzufügen')
    expect(addButton).toBeNull()
  })

  it('should add new card when clicking add button', () => {
    const { getByText } = renderWithTranslation(<AddCardsForm {...defaultProps} />)
    act(() => {
      fireEvent.click(getByText('Karte hinzufügen'))
      expect(defaultProps.setCards).toHaveBeenCalled()
    })
  })

  it('should remove card when clicking remove button', () => {
    const { getByTestId } = renderWithTranslation(<AddCardsForm {...defaultProps} cards={[card]} />, { wrapper })
    act(() => {
      fireEvent.click(getByTestId('remove-card'))
      expect(defaultProps.setCards).toHaveBeenCalledWith([])
    })
  })
})
