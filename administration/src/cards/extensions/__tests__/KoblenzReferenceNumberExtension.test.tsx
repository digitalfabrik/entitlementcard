import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import KoblenzReferenceNumberExtension from '../KoblenzReferenceNumberExtension'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

const mockSetValue = jest.fn()

describe('KoblenzReferenceNumberExtension', () => {
  it('should render the input field', () => {
    const { getByLabelText } = render(
      <KoblenzReferenceNumberExtension.Component
        value={{ koblenzReferenceNumber: '' }}
        setValue={mockSetValue}
        isValid
        showRequired={false}
      />
    )
    expect(getByLabelText('referenceNrLabel')).not.toBeNull()
  })

  it('should update value when user types', () => {
    const { getByLabelText } = render(
      <KoblenzReferenceNumberExtension.Component
        value={{ koblenzReferenceNumber: '' }}
        setValue={mockSetValue}
        isValid
        showRequired={false}
      />
    )
    const input = getByLabelText('referenceNrLabel')
    fireEvent.change(input, { target: { value: '12345' } })
    expect(mockSetValue).toHaveBeenCalledWith({ koblenzReferenceNumber: '12345' })
  })

  it('should show error for special characters', () => {
    const initialValue = '123@45'
    const { getByText, getByDisplayValue } = render(
      <KoblenzReferenceNumberExtension.Component
        value={{ koblenzReferenceNumber: initialValue }}
        setValue={mockSetValue}
        isValid={false}
        showRequired
      />
    )
    const input = getByDisplayValue(initialValue)
    fireEvent.blur(input)
    expect(getByText('referenceNrSpecialCharactersError')).not.toBeNull()
  })

  it('should show error for invalid length', () => {
    const initialValue = '123'
    const { getByDisplayValue, getByText } = render(
      <KoblenzReferenceNumberExtension.Component
        value={{ koblenzReferenceNumber: initialValue }}
        setValue={mockSetValue}
        isValid={false}
        showRequired
      />
    )
    const input = getByDisplayValue(initialValue)
    fireEvent.blur(input)
    expect(getByText('referenceNrInvalidLengthError')).not.toBeNull()
  })

  it('should clear input when clear button is clicked', () => {
    const { getByRole } = render(
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

  describe('isValid function', () => {
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
})
