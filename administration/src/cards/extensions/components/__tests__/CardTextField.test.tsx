import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import CardTextField from '../CardTextField'

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

  it('should render input field with label and placeholder', () => {
    const { getByLabelText } = render(<CardTextField {...defaultProps} />)

    const input = getByLabelText('Test Label')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('placeholder', 'Enter text')
  })

  it('should call onChange handler when input value changes', () => {
    const { getByLabelText } = render(<CardTextField {...defaultProps} />)

    const input = getByLabelText('Test Label')
    fireEvent.change(input, { target: { value: 'new value' } })

    expect(defaultProps.onChange).toHaveBeenCalledWith('new value')
  })

  it('should call onBlur handler when input loses focus', () => {
    const onBlur = jest.fn()
    const { getByLabelText } = render(<CardTextField {...defaultProps} onBlur={onBlur} />)

    const input = getByLabelText('Test Label')
    fireEvent.blur(input)

    expect(onBlur).toHaveBeenCalled()
  })

  it('should display error message when showError is true', () => {
    const { getByText } = render(<CardTextField {...defaultProps} showError errorMessage='Error occurred' />)

    expect(getByText('Error occurred')).toBeTruthy()
  })

  it('should be focused when autoFocus prop is true', () => {
    const { getByLabelText } = render(<CardTextField {...defaultProps} autoFocus />)

    const input = getByLabelText('Test Label')
    expect(input).toHaveFocus()
  })
})
