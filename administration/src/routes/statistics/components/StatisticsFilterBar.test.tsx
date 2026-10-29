import { act, fireEvent } from '@testing-library/react'
import { Intl } from 'temporal-polyfill'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CustomRenderOptions, renderWithOptions } from '../../../testing/render'
import { defaultStatisticsRange } from '../constants'
import StatisticsFilterBar from './StatisticsFilterBar'

vi.useFakeTimers()
const dateFormatter = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' })
const mockProvider: CustomRenderOptions = {
  localization: true,
  translation: true,
}
describe('StatisticFilterBar', () => {
  const onApplyFilter = vi.fn()
  const onExportCsv = vi.fn()

  beforeEach(vi.resetAllMocks)

  it('should execute onApplyFilter if filter button was clicked', async () => {
    const { getByText } = renderWithOptions(
      <StatisticsFilterBar
        dateRange={defaultStatisticsRange}
        onApplyFilter={onApplyFilter}
        isDataAvailable
        onExportCsv={onExportCsv}
      />,
      mockProvider,
    )
    const applyFilterButton = getByText('Filter anwenden')
    fireEvent.click(applyFilterButton)
    await act(async () => null) // Popper update() - https://github.com/popperjs/react-popper/issues/350
    expect(onApplyFilter).toHaveBeenCalled()
  })

  it('should disable filter button if start date is after end date', async () => {
    const { getByText, getByDisplayValue } = renderWithOptions(
      <StatisticsFilterBar
        dateRange={defaultStatisticsRange}
        onApplyFilter={onApplyFilter}
        isDataAvailable
        onExportCsv={onExportCsv}
      />,
      mockProvider,
    )
    const applyFilterButton = getByText('Filter anwenden')
    const startInput = getByDisplayValue(dateFormatter.format(defaultStatisticsRange.start))
    const endInput = getByDisplayValue(dateFormatter.format(defaultStatisticsRange.end))

    fireEvent.change(startInput, {
      target: {
        value: '01.06.2024',
      },
    })
    fireEvent.change(endInput, {
      target: {
        value: '01.02.2024',
      },
    })

    expect(applyFilterButton.closest('button')).toBeDisabled()
  })

  it('should disable filter button if input is not a correct date string', () => {
    const { getByText, getByDisplayValue } = renderWithOptions(
      <StatisticsFilterBar
        dateRange={defaultStatisticsRange}
        onApplyFilter={onApplyFilter}
        isDataAvailable
        onExportCsv={onExportCsv}
      />,
      mockProvider,
    )

    const applyFilterButton = getByText('Filter anwenden')
    const startInput = getByDisplayValue(dateFormatter.format(defaultStatisticsRange.start))

    fireEvent.change(startInput, {
      target: {
        value: '2024-06-xx',
      },
    })
    expect(applyFilterButton.closest('button')).toBeDisabled()
  })

  it('should display a proper tooltip message if filter button is disabled and filtering should not be applied', async () => {
    const { getByText, getByDisplayValue } = renderWithOptions(
      <StatisticsFilterBar
        dateRange={defaultStatisticsRange}
        onApplyFilter={onApplyFilter}
        isDataAvailable
        onExportCsv={onExportCsv}
      />,
      mockProvider,
    )
    const applyFilterButton = getByText('Filter anwenden')
    const startInput = getByDisplayValue(dateFormatter.format(defaultStatisticsRange.start))

    fireEvent.change(startInput, {
      target: {
        value: '2024-06-xx',
      },
    })
    fireEvent.mouseOver(applyFilterButton)
    fireEvent.click(applyFilterButton)

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    expect(
      getByText(
        'Bitte geben Sie ein gültiges Start- und Enddatum an. Das Enddatum darf nicht vor dem Startdatum liegen.',
      ),
    ).toBeTruthy()
    expect(onApplyFilter).not.toHaveBeenCalled()
  })

  it('should execute onExportCsv if csv export button was clicked', async () => {
    const { getByText } = renderWithOptions(
      <StatisticsFilterBar
        dateRange={defaultStatisticsRange}
        onApplyFilter={onApplyFilter}
        isDataAvailable
        onExportCsv={onExportCsv}
      />,
      mockProvider,
    )
    const csvExportButton = getByText('CSV Export')
    fireEvent.click(csvExportButton)
    await act(async () => null) // Popper update() - https://github.com/popperjs/react-popper/issues/350
    expect(onExportCsv).toHaveBeenCalled()
  })

  it('should disable csv export button if no data is available and show tooltip', async () => {
    const { getByText } = renderWithOptions(
      <StatisticsFilterBar
        dateRange={defaultStatisticsRange}
        onApplyFilter={onApplyFilter}
        isDataAvailable={false}
        onExportCsv={onExportCsv}
      />,
      mockProvider,
    )

    const csvExportButton = getByText('CSV Export')
    fireEvent.mouseOver(csvExportButton)
    fireEvent.click(csvExportButton)
    await act(async () => {
      vi.advanceTimersByTime(100)
    })
    expect(getByText('Es sind keine Daten zum Export verfügbar.')).toBeTruthy()
    expect(csvExportButton.closest('button')).toBeDisabled()
    expect(onExportCsv).not.toHaveBeenCalled()
  })
})
