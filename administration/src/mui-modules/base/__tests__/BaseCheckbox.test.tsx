import '@testing-library/jest-dom'
import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import BaseCheckbox from '../BaseCheckbox'

describe('BaseCheckbox', () => {
  const defaultProps = {
    label: 'Test Checkbox',
    checked: false,
    onChange: jest.fn(),
    hasError: false,
    errorMessage: null,
    touched: false,
    setTouched: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render checkbox with label', () => {
    const { getByLabelText } = render(<BaseCheckbox {...defaultProps} />)
    const checkbox = getByLabelText('Test Checkbox')
    expect(checkbox).toBeTruthy()
  })

  it('should handle onChange event', () => {
    const onChange = jest.fn()
    const { getByLabelText } = render(<BaseCheckbox {...defaultProps} onChange={onChange} />)

    const checkbox = getByLabelText('Test Checkbox')
    fireEvent.click(checkbox)

    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('should display error message when touched and has error', () => {
    const { getByText } = render(<BaseCheckbox {...defaultProps} touched hasError errorMessage='Error message' />)

    expect(getByText('Error message')).toBeTruthy()
  })

  it('should not display error message when not touched', () => {
    const { queryByText } = render(
      <BaseCheckbox {...defaultProps} touched={false} hasError errorMessage='Error message' />
    )

    expect(queryByText('Error message')).not.toBeTruthy()
  })

  it('should set touched on blur', () => {
    const setTouched = jest.fn()
    const { container } = render(<BaseCheckbox {...defaultProps} setTouched={setTouched} />)

    const formGroup = container.firstChild
    fireEvent.blur(formGroup as HTMLElement)

    expect(setTouched).toHaveBeenCalledWith(true)
  })

  it('should render with disabled state', () => {
    const { getByLabelText } = render(<BaseCheckbox {...defaultProps} disabled />)

    const checkbox = getByLabelText('Test Checkbox')
    expect(checkbox).toBeDisabled()
  })

  it('should render with required state', () => {
    const { getByLabelText } = render(<BaseCheckbox {...defaultProps} required />)

    const checkbox = getByLabelText('Test Checkbox *')
    expect(checkbox).toHaveAttribute('required')
  })

  it('should set touched and call onChange when checkbox is clicked', () => {
    const onChange = jest.fn()
    const setTouched = jest.fn()
    const { getByLabelText } = render(<BaseCheckbox {...defaultProps} onChange={onChange} setTouched={setTouched} />)

    const checkbox = getByLabelText('Test Checkbox')
    fireEvent.click(checkbox)

    expect(setTouched).toHaveBeenCalledWith(true)
    expect(onChange).toHaveBeenCalledWith(true)
  })
})
