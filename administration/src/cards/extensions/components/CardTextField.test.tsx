import { act, fireEvent, render } from '@testing-library/react'
import React from 'react'

import CardTextField from './CardTextField'

describe('CardTextField', () => {
  const defaultProps = {
    id: 'test-input',
    label: 'Test Label',
    placeholder: 'Enter text',
    value: '',
    onChange: jest.fn(),
    showError: false,
    errorMessage: null,
    inputProps: {},
  }

  // Replace setTimeout with a controlled implementation so we can advance time manually
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render input field with label and placeholder', () => {
    const { getByLabelText } = render(<CardTextField {...defaultProps} />)

    const input = getByLabelText('Test Label')
    expect(input).toBeTruthy()
    expect(input).toHaveAttribute('placeholder', 'Enter text')
  })

  it('should call onChange handler when input value changes', () => {
    const { getByLabelText } = render(<CardTextField {...defaultProps} />)

    const input = getByLabelText('Test Label')
    fireEvent.change(input, { target: { value: 'new value' } })

    expect(defaultProps.onChange).toHaveBeenCalledWith('new value')
  })

  it('should call onBlur handler when input loses focus', () => {
    const onBlurMock = jest.fn()
    const propsWithOnBlur = {
      ...defaultProps,
      inputProps: { onBlur: onBlurMock },
    }

    const { getByLabelText } = render(<CardTextField {...propsWithOnBlur} />)

    const input = getByLabelText('Test Label')
    fireEvent.blur(input)

    expect(onBlurMock).toHaveBeenCalled()
  })

  it('should display error message when showError is true', () => {
    const { getByText, getByLabelText } = render(
      <CardTextField {...defaultProps} showError errorMessage='Error occurred' />,
    )
    const input = getByLabelText('Test Label')
    fireEvent.blur(input)
    // Ignore timout for onBlur
    act(() => jest.runAllTimers())

    expect(getByText('Error occurred')).toBeTruthy()
  })

  it('should be focused when autoFocus prop is true', () => {
    const { getByLabelText } = render(<CardTextField {...defaultProps} autoFocus />)

    const input = getByLabelText('Test Label')
    expect(input).toHaveFocus()
  })
})
