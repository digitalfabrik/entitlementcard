import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import BavariaCardTypeExtension, {
  BAVARIA_CARD_TYPE_GOLD,
  BAVARIA_CARD_TYPE_STANDARD,
  BavariaCardTypeExtensionState,
} from '../BavariaCardTypeExtension'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('BavariaCardTypeExtension', () => {
  const mockSetValue = jest.fn()
  const defaultProps = {
    value: { bavariaCardType: BAVARIA_CARD_TYPE_STANDARD } as BavariaCardTypeExtensionState,
    setValue: mockSetValue,
    isValid: true,
    showRequired: false,
  }

  it('should render the component with default value', () => {
    const { getByLabelText } = render(<BavariaCardTypeExtension.Component {...defaultProps} />)

    const select = getByLabelText('bavariaCardTypeLabel')
    expect(select).toBeInTheDocument()
  })

  it('should display both card type options', () => {
    const { getByLabelText, getAllByRole } = render(<BavariaCardTypeExtension.Component {...defaultProps} />)

    const select = getByLabelText('bavariaCardTypeLabel')
    fireEvent.mouseDown(select)

    const options = getAllByRole('option')
    expect(options).toHaveLength(2)
    expect(options[0]).toHaveTextContent(BAVARIA_CARD_TYPE_STANDARD)
    expect(options[1]).toHaveTextContent(BAVARIA_CARD_TYPE_GOLD)
  })

  it('should call setValue with correct value when an option is selected', () => {
    const { getByLabelText, getByText } = render(<BavariaCardTypeExtension.Component {...defaultProps} />)

    const select = getByLabelText('bavariaCardTypeLabel')
    fireEvent.mouseDown(select)
    const goldOption = getByText(BAVARIA_CARD_TYPE_GOLD)
    fireEvent.click(goldOption)

    expect(mockSetValue).toHaveBeenCalledWith({ bavariaCardType: BAVARIA_CARD_TYPE_GOLD })
  })

  it('fromString function should result in the correct type for standard card', () => {
    const result = BavariaCardTypeExtension.fromString(BAVARIA_CARD_TYPE_STANDARD)
    expect(result).toEqual({ bavariaCardType: BAVARIA_CARD_TYPE_STANDARD })
  })

  it('fromString function should result in the correct type for gold card', () => {
    const result = BavariaCardTypeExtension.fromString(BAVARIA_CARD_TYPE_GOLD)
    expect(result).toEqual({ bavariaCardType: BAVARIA_CARD_TYPE_GOLD })
  })

  it('toString function should result in the correct type', () => {
    const state = { bavariaCardType: BAVARIA_CARD_TYPE_GOLD } as BavariaCardTypeExtensionState
    const result = BavariaCardTypeExtension.toString(state)
    expect(result).toBe(BAVARIA_CARD_TYPE_GOLD)
  })

  it('isValid function should validate correctly', () => {
    expect(BavariaCardTypeExtension.isValid({ bavariaCardType: BAVARIA_CARD_TYPE_STANDARD })).toBe(true)
    expect(BavariaCardTypeExtension.isValid({ bavariaCardType: BAVARIA_CARD_TYPE_GOLD })).toBe(true)
  })
})
