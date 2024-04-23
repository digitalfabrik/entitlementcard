import { act, fireEvent, render } from '@testing-library/react'

import { defaultEndDate, defaultStartDate } from '../constants'
import StatisticsFilterBar from './StatisticsFilterBar'

jest.useFakeTimers()
describe('StatisticFilterBar', () => {
  const onApplyFilter = jest.fn()

  it('should execute onApplyFilter if button was clicked', async () => {
    const { getByText } = render(<StatisticsFilterBar onApplyFilter={onApplyFilter} />)
    const applyFilterButton = getByText('Filter anwenden')
    fireEvent.click(applyFilterButton)
    await act(async () => await null) // Popper update() - https://github.com/popperjs/react-popper/issues/350
    expect(onApplyFilter).toHaveBeenCalled()
  })

  it('should disable filter button if start date is after end date', async () => {
    const { getByText, getByDisplayValue } = render(<StatisticsFilterBar onApplyFilter={onApplyFilter} />)
    const applyFilterButton = getByText('Filter anwenden')
    const startInput = getByDisplayValue(defaultStartDate)
    const endInput = getByDisplayValue(defaultEndDate)
    fireEvent.change(startInput, {
      target: {
        value: '2024-06-01',
      },
    })
    fireEvent.change(endInput, {
      target: {
        value: '2024-02-01',
      },
    })
    expect(applyFilterButton.closest('button')).toBeDisabled()
  })

  it('should disable filter button if input is not a correct date string', () => {
    const { getByText, getByDisplayValue } = render(<StatisticsFilterBar onApplyFilter={onApplyFilter} />)
    const applyFilterButton = getByText('Filter anwenden')
    const startInput = getByDisplayValue(defaultStartDate)
    fireEvent.change(startInput, {
      target: {
        value: '2024-06-xx',
      },
    })
    expect(applyFilterButton.closest('button')).toBeDisabled()
  })

  it('should display a proper tooltip message if filter button is disabled and filtering should not be applied', async () => {
    const { getByText, getByDisplayValue } = render(<StatisticsFilterBar onApplyFilter={onApplyFilter} />)
    const startInput = getByDisplayValue(defaultStartDate)
    fireEvent.change(startInput, {
      target: {
        value: '2024-06-xx',
      },
    })
    const applyFilterButton = getByText('Filter anwenden')
    fireEvent.mouseOver(applyFilterButton)
    fireEvent.click(applyFilterButton)
    await act(async () => {
      jest.advanceTimersByTime(100)
    })
    expect(
      getByText('Bitte geben Sie ein gültiges Start- und Enddatum an. Das Startdatum muss vor dem Enddatum liegen.')
    ).toBeTruthy()
    expect(onApplyFilter).not.toHaveBeenCalled()
  })
})
