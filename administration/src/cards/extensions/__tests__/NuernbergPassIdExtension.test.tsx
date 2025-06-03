import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import NuernbergPassIdExtension from '../NuernbergPassIdExtension'

// Mock translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

describe('NuernbergPassIdExtension', () => {
  const mockSetValue = jest.fn()
  const defaultProps = {
    value: { nuernbergPassId: null },
    setValue: mockSetValue,
    isValid: true,
    showRequired: true,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render input field with correct placeholder and label', () => {
    const { getByLabelText } = render(<NuernbergPassIdExtension.Component {...defaultProps} />)

    const input = getByLabelText('Nürnberg-Pass-ID')
    expect(input).toHaveAttribute('placeholder', '12345678')
  })

  it('should allow entering valid numeric values', () => {
    const { getByLabelText } = render(<NuernbergPassIdExtension.Component {...defaultProps} />)
    const input = getByLabelText('Nürnberg-Pass-ID')

    fireEvent.change(input, { target: { value: '123456' } })

    expect(mockSetValue).toHaveBeenCalledWith({ nuernbergPassId: 123456 })
  })

  it('should clear input when clear button is clicked', () => {
    const props = {
      ...defaultProps,
      value: { nuernbergPassId: 123456 },
    }

    const { getByRole } = render(<NuernbergPassIdExtension.Component {...props} />)
    const clearButton = getByRole('button')

    fireEvent.click(clearButton)

    expect(mockSetValue).toHaveBeenCalledWith({ nuernbergPassId: null })
  })

  it('should show error message when invalid and touched', () => {
    const props = {
      ...defaultProps,
      isValid: false,
    }

    const { getByLabelText, getByText } = render(<NuernbergPassIdExtension.Component {...props} />)
    const input = getByLabelText('Nürnberg-Pass-ID')

    fireEvent.change(input, { target: { value: '123' } })
    fireEvent.blur(input)

    const errorMessage = getByText('nuernbergPassIdError')
    expect(errorMessage).not.toBeNull()
  })

  describe('validation', () => {
    it('should validate empty input as invalid', () => {
      const isValid = NuernbergPassIdExtension.isValid({ nuernbergPassId: null })
      expect(isValid).toBe(false)
    })

    it('should validate number within valid range', () => {
      const isValid = NuernbergPassIdExtension.isValid({ nuernbergPassId: 123456789 })
      expect(isValid).toBe(true)
    })

    it('should validate number outside valid range as invalid', () => {
      const isValid = NuernbergPassIdExtension.isValid({ nuernbergPassId: 1000000000 })
      expect(isValid).toBe(false)
    })
  })

  it('should handle non-numeric input correctly', () => {
    const { getByLabelText } = render(<NuernbergPassIdExtension.Component {...defaultProps} />)
    const input = getByLabelText('Nürnberg-Pass-ID')

    fireEvent.change(input, { target: { value: 'abc' } })

    expect(mockSetValue).toHaveBeenCalledWith({ nuernbergPassId: null })
  })

  it('should prevent input longer than maximum length', () => {
    const { getByLabelText } = render(<NuernbergPassIdExtension.Component {...defaultProps} />)
    const input = getByLabelText('Nürnberg-Pass-ID')

    fireEvent.change(input, { target: { value: '1234567890' } })

    expect(mockSetValue).not.toHaveBeenCalled()
  })
})
