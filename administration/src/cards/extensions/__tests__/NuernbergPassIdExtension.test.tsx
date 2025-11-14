import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithOptions } from '../../../testing/render'
import NuernbergPassIdExtension from '../NuernbergPassIdExtension'

describe('NuernbergPassIdExtension', () => {
  const mockSetValue = jest.fn()
  const defaultProps = {
    value: { nuernbergPassId: null },
    setValue: mockSetValue,
    isValid: true,
    forceError: true,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Component', () => {
    it('should render input field with correct placeholder and label', () => {
      const { getByLabelText } = renderWithOptions(<NuernbergPassIdExtension.Component {...defaultProps} />, {
        translation: true,
      })

      const input = getByLabelText('Nürnberg-Pass-ID')
      expect(input).toHaveAttribute('placeholder', '12345678')
    })

    it('should allow entering valid numeric values', () => {
      const { getByLabelText } = renderWithOptions(<NuernbergPassIdExtension.Component {...defaultProps} />, {
        translation: true,
      })
      const input = getByLabelText('Nürnberg-Pass-ID')

      fireEvent.change(input, { target: { value: '123456' } })

      expect(mockSetValue).toHaveBeenCalledWith({ nuernbergPassId: 123456 })
    })

    it('should clear input when clear button is clicked', () => {
      const props = {
        ...defaultProps,
        value: { nuernbergPassId: 123456 },
      }

      const { getByRole } = renderWithOptions(<NuernbergPassIdExtension.Component {...props} />, { translation: true })
      const clearButton = getByRole('button')

      fireEvent.click(clearButton)

      expect(mockSetValue).toHaveBeenCalledWith({ nuernbergPassId: null })
    })

    it('should show error message when invalid and touched', () => {
      const props = {
        ...defaultProps,
        isValid: false,
      }

      const { getByLabelText, getByText } = renderWithOptions(<NuernbergPassIdExtension.Component {...props} />, {
        translation: true,
      })
      const input = getByLabelText('Nürnberg-Pass-ID')

      fireEvent.change(input, { target: { value: '123' } })
      fireEvent.blur(input)

      const errorMessage = getByText('Bitte geben Sie eine gültige Nürnberg-Pass-ID ein.')
      expect(errorMessage).toBeTruthy()
    })

    it('should handle non-numeric input correctly', () => {
      const { getByLabelText } = renderWithOptions(<NuernbergPassIdExtension.Component {...defaultProps} />, {
        translation: true,
      })
      const input = getByLabelText('Nürnberg-Pass-ID')

      fireEvent.change(input, { target: { value: 'abc' } })

      expect(mockSetValue).toHaveBeenCalledWith({ nuernbergPassId: null })
    })

    it('should prevent input longer than maximum length', () => {
      const { getByLabelText } = renderWithOptions(<NuernbergPassIdExtension.Component {...defaultProps} />, {
        translation: true,
      })
      const input = getByLabelText('Nürnberg-Pass-ID')

      fireEvent.change(input, { target: { value: '1234567890' } })

      expect(mockSetValue).not.toHaveBeenCalled()
    })

    describe('isValid', () => {
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

    describe('getProtobufData', () => {
      it('should result in correct days since epoch 1970', () => {
        expect(NuernbergPassIdExtension.getProtobufData({ nuernbergPassId: 2222123123 })).toEqual({
          extensionNuernbergPassId: { identifier: 1, passId: 2222123123 },
        })
      })
    })

    describe('getInitializeState', () => {
      it('should initialize nuernbergPassId with null', () => {
        expect(NuernbergPassIdExtension.getInitialState()).toEqual({ nuernbergPassId: null })
      })
    })
  })
})
