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
  }

  it('should render checkbox with label', () => {
    const { getByLabelText } = render(<BaseCheckbox {...defaultProps} />)
    const checkbox = getByLabelText('Test Checkbox')
    expect(checkbox).toBeTruthy()
  })

  it('should call onChange when clicked', () => {
    const onChange = jest.fn()
    const { getByLabelText } = render(<BaseCheckbox {...defaultProps} onChange={onChange} />)

    const checkbox = getByLabelText('Test Checkbox')
    fireEvent.click(checkbox)

    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('should display error message when hasError is true', () => {
    const { getByText } = render(
      <BaseCheckbox {...defaultProps} hasError errorMessage='Error occurred' />,
    )

    expect(getByText('Error occurred')).toBeTruthy()
  })

  it('should not display error message when hasError is false', () => {
    const { queryByText } = render(
      <BaseCheckbox {...defaultProps} hasError={false} errorMessage='Error occurred' />,
    )

    expect(queryByText('Error occurred')).toBeNull()
  })

  it('should be disabled when disabled prop is true', () => {
    const { getByLabelText } = render(<BaseCheckbox {...defaultProps} disabled />)

    const checkbox = getByLabelText('Test Checkbox')
    expect(checkbox).toHaveAttribute('disabled')
  })

  it('should call onBlur when focus is lost', () => {
    const onBlur = jest.fn()
    const { getByLabelText } = render(<BaseCheckbox {...defaultProps} onBlur={onBlur} />)

    const checkbox = getByLabelText('Test Checkbox')
    fireEvent.blur(checkbox)

    expect(onBlur).toHaveBeenCalled()
  })

  it('should render with required attribute when required prop is true', () => {
    const { getByLabelText } = render(<BaseCheckbox {...defaultProps} required />)

    const checkbox = getByLabelText('Test Checkbox *')
    expect(checkbox).toHaveAttribute('required')
  })
})
