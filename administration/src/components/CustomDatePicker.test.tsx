import { act, fireEvent } from '@testing-library/react'
import React from 'react'
import { Temporal } from 'temporal-polyfill'

import { renderWithOptions } from '../testing/render'
import CustomDatePicker from './CustomDatePicker'

const typeIntoSection = (section: HTMLElement, text: string) => {
  act(() => section.focus())
  fireEvent.click(section)
  section.textContent = text
  fireEvent.input(section)
}

describe('CustomDatePicker', () => {
  it('should call onChange with the entered date', () => {
    const onChange = jest.fn()
    const { getAllByRole } = renderWithOptions(
      <CustomDatePicker error={false} onChange={onChange} />,
      {
        localization: true,
      },
    )
    const [day, month, year] = getAllByRole('spinbutton')

    typeIntoSection(day, '28')
    typeIntoSection(month, '02')
    typeIntoSection(year, '2020')

    expect(onChange).toHaveBeenLastCalledWith(new Temporal.PlainDate(2020, 2, 28))
  })

  it('should call onChange with null for an impossible date', () => {
    const onChange = jest.fn()
    const { getAllByRole } = renderWithOptions(
      <CustomDatePicker error={false} onChange={onChange} />,
      {
        localization: true,
      },
    )
    const [day, month, year] = getAllByRole('spinbutton')

    typeIntoSection(day, '31')
    typeIntoSection(month, '02')
    typeIntoSection(year, '2020')

    expect(onChange).toHaveBeenLastCalledWith(null)
  })
})
