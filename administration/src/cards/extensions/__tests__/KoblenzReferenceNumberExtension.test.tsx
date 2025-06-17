import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithTranslation } from '../../../testing/render'
import KoblenzReferenceNumberExtension from '../KoblenzReferenceNumberExtension'

const mockSetValue = jest.fn()

describe('KoblenzReferenceNumberExtension', () => {
  describe('Component', () => {
    it('should render the input field', () => {
      const { getByLabelText } = renderWithTranslation(
        <KoblenzReferenceNumberExtension.Component
          value={{ koblenzReferenceNumber: '' }}
          setValue={mockSetValue}
          isValid
          showRequired={false}
        />
      )
      expect(getByLabelText('Aktenzeichen')).toBeTruthy()
    })

    it('should render the correct placeholder', () => {
      const { getByPlaceholderText } = renderWithTranslation(
        <KoblenzReferenceNumberExtension.Component
          value={{ koblenzReferenceNumber: '' }}
          setValue={mockSetValue}
          isValid
          showRequired={false}
        />
      )
      expect(getByPlaceholderText('5.031.025.281, 000D000001, 91459')).toBeTruthy()
    })

    it('should update value when user types', () => {
      const { getByLabelText } = renderWithTranslation(
        <KoblenzReferenceNumberExtension.Component
          value={{ koblenzReferenceNumber: '' }}
          setValue={mockSetValue}
          isValid
          showRequired={false}
        />
      )
      const input = getByLabelText('Aktenzeichen')
      fireEvent.change(input, { target: { value: '12345' } })
      expect(mockSetValue).toHaveBeenCalledWith({ koblenzReferenceNumber: '12345' })
    })

    it('should not show error message if field was not left and required is false', () => {
      const initialValue = '123@45'
      const { queryByText } = renderWithTranslation(
        <KoblenzReferenceNumberExtension.Component
          value={{ koblenzReferenceNumber: initialValue }}
          setValue={mockSetValue}
          isValid={false}
          showRequired={false}
        />
      )
      expect(queryByText('Das Aktenzeichen enthält ungültige Sonderzeichen.')).toBeNull()
    })

    it('should show error for special characters', () => {
      const initialValue = '123@45'
      const { getByText, getByDisplayValue } = renderWithTranslation(
        <KoblenzReferenceNumberExtension.Component
          value={{ koblenzReferenceNumber: initialValue }}
          setValue={mockSetValue}
          isValid={false}
          showRequired
        />
      )
      const input = getByDisplayValue(initialValue)
      fireEvent.blur(input)
      expect(getByText('Das Aktenzeichen enthält ungültige Sonderzeichen.')).toBeTruthy()
    })

    it('should show error if the value is too short', () => {
      const initialValue = '123'
      const { getByDisplayValue, getByText } = renderWithTranslation(
        <KoblenzReferenceNumberExtension.Component
          value={{ koblenzReferenceNumber: initialValue }}
          setValue={mockSetValue}
          isValid={false}
          showRequired
        />
      )
      const input = getByDisplayValue(initialValue)
      fireEvent.blur(input)
      expect(getByText('Das Aktenzeichen muss eine Länge zwischen 4 und 15 haben.')).toBeTruthy()
    })

    it('should show error if the value exceeds the max length', () => {
      const initialValue = '123KKdas22sdas23'
      const { getByDisplayValue, getByText } = renderWithTranslation(
        <KoblenzReferenceNumberExtension.Component
          value={{ koblenzReferenceNumber: initialValue }}
          setValue={mockSetValue}
          isValid={false}
          showRequired
        />
      )
      const input = getByDisplayValue(initialValue)
      fireEvent.blur(input)
      expect(getByText('Das Aktenzeichen muss eine Länge zwischen 4 und 15 haben.')).toBeTruthy()
    })

    it('should clear input when clear button is clicked', () => {
      const { getByRole } = renderWithTranslation(
        <KoblenzReferenceNumberExtension.Component
          value={{ koblenzReferenceNumber: '12345' }}
          setValue={mockSetValue}
          isValid
          showRequired={false}
        />
      )

      const clearButton = getByRole('button')
      fireEvent.click(clearButton)
      expect(mockSetValue).toHaveBeenCalledWith({ koblenzReferenceNumber: '' })
    })

    describe('isValid', () => {
      it('should return true for valid reference number', () => {
        const result = KoblenzReferenceNumberExtension.isValid({
          koblenzReferenceNumber: '12345',
        })
        expect(result).toBe(true)
      })

      it('should return false for reference number with special characters', () => {
        const result = KoblenzReferenceNumberExtension.isValid({
          koblenzReferenceNumber: '123@45',
        })
        expect(result).toBe(false)
      })

      it('should return false for too short reference number', () => {
        const result = KoblenzReferenceNumberExtension.isValid({
          koblenzReferenceNumber: '123',
        })
        expect(result).toBe(false)
      })
    })

    describe('getInitializeState', () => {
      it('should initialize koblenzReferenceNumber state with today', () => {
        expect(KoblenzReferenceNumberExtension.getInitialState()).toEqual({ koblenzReferenceNumber: '' })
      })
    })

    describe('Extension name', () => {
      it('should not change to ensure correct user hashes', () => {
        expect(KoblenzReferenceNumberExtension.name).toBe('koblenzReferenceNumber')
      })
    })
  })
})
