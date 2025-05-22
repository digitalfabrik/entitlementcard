import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import CardTextField from '../CardTextField'

describe('CardTextField', () => {
  const defaultProps = {
    id: 'test-input',
    label: 'Test Label',
    placeholder: 'Test Placeholder',
    value: '',
    onChange: jest.fn(),
    hasError: false,
    errorMessage: null,
    touched: false,
    setTouched: jest.fn(),
    inputProps: {},
  }

  it('should render component with base props', () => {
    const { getByLabelText } = render(<CardTextField {...defaultProps} />)
    const input = getByLabelText('Test Label')

    expect(input).toBeTruthy()
    expect(input).toHaveAttribute('id', 'test-input')
    expect(input).toHaveAttribute('placeholder', 'Test Placeholder')
  })

  it('should call onChange with correct value', () => {
    const { getByLabelText } = render(<CardTextField {...defaultProps} />)
    const input = getByLabelText('Test Label')

    fireEvent.change(input, { target: { value: 'New Value' } })
    expect(defaultProps.onChange).toHaveBeenCalledWith('New Value')
  })

  it('should call setTouched when field is blurred', () => {
    const { getByLabelText } = render(<CardTextField {...defaultProps} />)
    const input = getByLabelText('Test Label')

    fireEvent.blur(input)
    expect(defaultProps.setTouched).toHaveBeenCalledWith(true)
  })

  it('should display error message when hasError and touched are true', () => {
    const propsWithError = {
      ...defaultProps,
      hasError: true,
      touched: true,
      errorMessage: 'Test error message',
    }

    const { getByText } = render(<CardTextField {...propsWithError} />)
    expect(getByText('Test error message')).toBeTruthy()
  })

  it('should not display error message when hasError is false', () => {
    const propsWithError = {
      ...defaultProps,
      hasError: false,
      touched: true,
      errorMessage: 'Test error message',
    }

    const { queryByText } = render(<CardTextField {...propsWithError} />)
    expect(queryByText('Test error message')).toBeFalsy()
  })

  it('should not display error message when touched is false', () => {
    const propsWithError = {
      ...defaultProps,
      hasError: true,
      touched: false,
      errorMessage: 'Test error message',
    }

    const { queryByText } = render(<CardTextField {...propsWithError} />)
    expect(queryByText('Test error message')).toBeFalsy()
  })
})
