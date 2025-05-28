import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { act, fireEvent } from '@testing-library/react'
import { formatDate } from 'date-fns/format'
import React from 'react'

import { renderWithTranslation } from '../../../testing/render'
import { defaultEndDate, defaultStartDate } from '../constants'
import StatisticsFilterBar from './StatisticsFilterBar'

jest.useFakeTimers()
const dateFormat = 'dd.MM.yyyy'

describe('StatisticFilterBar', () => {
  const onApplyFilter = jest.fn()
  const onExportCsv = jest.fn()

  beforeEach(jest.resetAllMocks)

  it('should execute onApplyFilter if filter button was clicked', async () => {
    const { getByText } = renderWithTranslation(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StatisticsFilterBar onApplyFilter={onApplyFilter} isDataAvailable onExportCsv={onExportCsv} />
      </LocalizationProvider>
    )
    const applyFilterButton = getByText('Filter anwenden')
    fireEvent.click(applyFilterButton)
    await act(async () => null) // Popper update() - https://github.com/popperjs/react-popper/issues/350
    expect(onApplyFilter).toHaveBeenCalled()
  })

  it('should disable filter button if start date is after end date', async () => {
    const { getByText, getByDisplayValue } = renderWithTranslation(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StatisticsFilterBar onApplyFilter={onApplyFilter} isDataAvailable onExportCsv={onExportCsv} />
      </LocalizationProvider>
    )
    const applyFilterButton = getByText('Filter anwenden')
    const startInput = getByDisplayValue(formatDate(defaultStartDate.toLocalDate(), dateFormat))
    const endInput = getByDisplayValue(formatDate(defaultEndDate.toLocalDate(), dateFormat))

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
    const { getByText, getByDisplayValue } = renderWithTranslation(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StatisticsFilterBar onApplyFilter={onApplyFilter} isDataAvailable onExportCsv={onExportCsv} />
      </LocalizationProvider>
    )

    const applyFilterButton = getByText('Filter anwenden')
    const startInput = getByDisplayValue(formatDate(defaultStartDate.toLocalDate(), dateFormat))

    fireEvent.change(startInput, {
      target: {
        value: '2024-06-xx',
      },
    })
    expect(applyFilterButton.closest('button')).toBeDisabled()
  })

  it('should display a proper tooltip message if filter button is disabled and filtering should not be applied', async () => {
    const { getByText, getByDisplayValue } = renderWithTranslation(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StatisticsFilterBar onApplyFilter={onApplyFilter} isDataAvailable onExportCsv={onExportCsv} />
      </LocalizationProvider>
    )
    const applyFilterButton = getByText('Filter anwenden')
    const startInput = getByDisplayValue(formatDate(defaultStartDate.toLocalDate(), dateFormat))

    fireEvent.change(startInput, {
      target: {
        value: '2024-06-xx',
      },
    })
    fireEvent.mouseOver(applyFilterButton)
    fireEvent.click(applyFilterButton)

    await act(async () => {
      jest.advanceTimersByTime(100)
    })

    expect(
      getByText(
        'Bitte geben Sie ein gültiges Start- und Enddatum an. Das Enddatum darf nicht vor dem Startdatum liegen.'
      )
    ).toBeTruthy()
    expect(onApplyFilter).not.toHaveBeenCalled()
  })

  it('should execute onExportCsv if csv export button was clicked', async () => {
    const { getByText } = renderWithTranslation(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StatisticsFilterBar onApplyFilter={onApplyFilter} isDataAvailable onExportCsv={onExportCsv} />
      </LocalizationProvider>
    )
    const csvExportButton = getByText('CSV Export')
    fireEvent.click(csvExportButton)
    await act(async () => null) // Popper update() - https://github.com/popperjs/react-popper/issues/350
    expect(onExportCsv).toHaveBeenCalled()
  })

  it('should disable csv export button if no data is available and show tooltip', async () => {
    const { getByText } = renderWithTranslation(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StatisticsFilterBar onApplyFilter={onApplyFilter} isDataAvailable={false} onExportCsv={onExportCsv} />
      </LocalizationProvider>
    )

    const csvExportButton = getByText('CSV Export')
    fireEvent.mouseOver(csvExportButton)
    fireEvent.click(csvExportButton)
    await act(async () => {
      jest.advanceTimersByTime(100)
    })
    expect(getByText('Es sind keine Daten zum Export verfügbar.')).toBeTruthy()
    expect(csvExportButton.closest('button')).toBeDisabled()
    expect(onExportCsv).not.toHaveBeenCalled()
  })
})
