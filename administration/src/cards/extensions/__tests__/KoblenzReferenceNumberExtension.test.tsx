import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithOptions } from '../../../testing/render'
import KoblenzReferenceNumberExtension from '../KoblenzReferenceNumberExtension'

const mockSetValue = jest.fn()

describe('KoblenzReferenceNumberExtension', () => {
  describe('Component', () => {
    it('should render the input field', () => {
      const { getByLabelText } = renderWithOptions(
        <KoblenzReferenceNumberExtension.Component
          value={{ koblenzReferenceNumber: '' }}
          setValue={mockSetValue}
          isValid
          forceError={false}
        />,
        { translation: true }
      )
      expect(
        KoblenzReferenceNumberExtension.isValid({
          koblenzReferenceNumber: '',
        })
      ).toBe(false)
      expect(getByLabelText('Aktenzeichen')).toBeTruthy()
    })

    it('should render the correct placeholder', () => {
      const { getByPlaceholderText } = renderWithOptions(
        <KoblenzReferenceNumberExtension.Component
          value={{ koblenzReferenceNumber: '' }}
          setValue={mockSetValue}
          isValid
          forceError={false}
        />,
        { translation: true }
      )
      expect(
        KoblenzReferenceNumberExtension.isValid({
          koblenzReferenceNumber: '',
        })
      ).toBe(false)
      expect(getByPlaceholderText('5.031.025.281, 000D000001, 91459')).toBeTruthy()
    })

    it('should update value when user types', () => {
      const { getByLabelText } = renderWithOptions(
        <KoblenzReferenceNumberExtension.Component
          value={{ koblenzReferenceNumber: '' }}
          setValue={mockSetValue}
          isValid
          forceError={false}
        />,
        { translation: true }
      )
      const input = getByLabelText('Aktenzeichen')
      fireEvent.change(input, { target: { value: '12345' } })
      expect(
        KoblenzReferenceNumberExtension.isValid({
          koblenzReferenceNumber: '12345',
        })
      ).toBe(true)
      expect(mockSetValue).toHaveBeenCalledWith({ koblenzReferenceNumber: '12345' })
    })

    it('should not show error message if field was not left and required is false', () => {
      const initialValue = '123@45'
      const { queryByTestId } = renderWithOptions(
        <KoblenzReferenceNumberExtension.Component
          value={{ koblenzReferenceNumber: initialValue }}
          setValue={mockSetValue}
          isValid={false}
          forceError={false}
        />,
        { translation: true }
      )
      expect(
        KoblenzReferenceNumberExtension.isValid({
          koblenzReferenceNumber: initialValue,
        })
      ).toBe(false)
      expect(queryByTestId('form-alert')).toBeNull()
    })

    it('should show error for special characters', () => {
      const initialValue = '123@45'
      const { getByText, getByDisplayValue } = renderWithOptions(
        <KoblenzReferenceNumberExtension.Component
          value={{ koblenzReferenceNumber: initialValue }}
          setValue={mockSetValue}
          isValid={false}
          forceError
        />,
        { translation: true }
      )
      const input = getByDisplayValue(initialValue)
      fireEvent.blur(input)
      expect(
        KoblenzReferenceNumberExtension.isValid({
          koblenzReferenceNumber: initialValue,
        })
      ).toBe(false)
      expect(getByText('Das Aktenzeichen enthält ungültige Sonderzeichen.')).toBeTruthy()
    })

    it('should show error if the value is too short', () => {
      const initialValue = '123'
      const { getByDisplayValue, getByText } = renderWithOptions(
        <KoblenzReferenceNumberExtension.Component
          value={{ koblenzReferenceNumber: initialValue }}
          setValue={mockSetValue}
          isValid={false}
          forceError
        />,
        { translation: true }
      )
      const input = getByDisplayValue(initialValue)
      fireEvent.blur(input)
      expect(
        KoblenzReferenceNumberExtension.isValid({
          koblenzReferenceNumber: initialValue,
        })
      ).toBe(false)
      expect(getByText('Das Aktenzeichen muss eine Länge zwischen 4 und 15 haben.')).toBeTruthy()
    })

    it('should show error if the value exceeds the max length', () => {
      const initialValue = '123KKdas22sdas23'
      const { getByDisplayValue, getByText } = renderWithOptions(
        <KoblenzReferenceNumberExtension.Component
          value={{ koblenzReferenceNumber: initialValue }}
          setValue={mockSetValue}
          isValid={false}
          forceError
        />,
        { translation: true }
      )
      const input = getByDisplayValue(initialValue)
      fireEvent.blur(input)
      expect(
        KoblenzReferenceNumberExtension.isValid({
          koblenzReferenceNumber: initialValue,
        })
      ).toBe(false)
      expect(getByText('Das Aktenzeichen muss eine Länge zwischen 4 und 15 haben.')).toBeTruthy()
    })

    it('should clear input when clear button is clicked', () => {
      const { getByRole } = renderWithOptions(
        <KoblenzReferenceNumberExtension.Component
          value={{ koblenzReferenceNumber: '12345' }}
          setValue={mockSetValue}
          isValid
          forceError={false}
        />,
        { translation: true }
      )

      const clearButton = getByRole('button')
      fireEvent.click(clearButton)
      expect(mockSetValue).toHaveBeenCalledWith({ koblenzReferenceNumber: '' })
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
