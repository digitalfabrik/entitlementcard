import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { fireEvent } from '@testing-library/react'
import React, { ReactNode } from 'react'

import { AppToasterProvider } from '../../../bp-modules/AppToaster'
import { renderWithTranslation } from '../../../testing/render'
import PlainDate from '../../../util/PlainDate'
import StartDayExtension from '../StartDayExtension'

const wrapper = ({ children }: { children: ReactNode }) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <AppToasterProvider>{children}</AppToasterProvider>
  </LocalizationProvider>
)

jest.useFakeTimers({ now: new Date('2024-01-01T00:00:00.000Z') })

describe('StartDayExtension', () => {
  describe('Component', () => {
    const mockSetValue = jest.fn()
    const defaultProps = {
      value: { startDay: new PlainDate(2024, 1, 1) },
      setValue: mockSetValue,
      isValid: true,
      showRequired: true,
    }

    it('should render date picker with correct initial value', () => {
      const { getByDisplayValue } = renderWithTranslation(<StartDayExtension.Component {...defaultProps} />, {
        wrapper,
      })

      expect(getByDisplayValue('01.01.2024')).toBeTruthy()
    })

    it('should show error message when form is invalid and touched', () => {
      const { getByText, getByDisplayValue, getByTitle } = renderWithTranslation(
        <StartDayExtension.Component {...defaultProps} isValid={false} />,
        { wrapper }
      )
      const clearButton = getByTitle('Wert leeren')
      const datePicker = getByDisplayValue('01.01.2024')
      fireEvent.click(clearButton)
      fireEvent.blur(datePicker)
      expect(getByText('Bitte geben Sie ein gültiges Startdatum ein, das in der Vergangenheit liegt.')).toBeTruthy()
    })

    it('should not show error message when form is invalid but untouched', () => {
      const { queryByText } = renderWithTranslation(<StartDayExtension.Component {...defaultProps} isValid={false} />, {
        wrapper,
      })

      const errorMessage = queryByText('Bitte geben Sie ein gültiges Startdatum ein, das in der Vergangenheit liegt.')
      expect(errorMessage).toBeNull()
    })

    it('should call setValue when date is changed', () => {
      const { getByDisplayValue } = renderWithTranslation(<StartDayExtension.Component {...defaultProps} />, {
        wrapper,
      })
      const datePicker = getByDisplayValue('01.01.2024')

      fireEvent.change(datePicker, { target: { value: '02.01.2025' } })
      expect(mockSetValue).toHaveBeenCalledWith({ startDay: { day: 2, isoMonth: 1, isoYear: 2025 } })
    })

    it('should set startDay to null if no valid date was typed in', () => {
      const { getByDisplayValue } = renderWithTranslation(<StartDayExtension.Component {...defaultProps} />, {
        wrapper,
      })
      const datePicker = getByDisplayValue('01.01.2024')

      fireEvent.change(datePicker, { target: { value: '02' } })
      expect(mockSetValue).toHaveBeenCalledWith({ startDay: null })
    })

    describe('getProtobufData', () => {
      it('should result in correct days since epoch 1970', () => {
        expect(StartDayExtension.getProtobufData({ startDay: new PlainDate(2022, 1, 1) })).toEqual({
          extensionStartDay: { startDay: 18993 },
        })
      })

      it('should result in minStartDay if no startDay is provided', () => {
        expect(StartDayExtension.getProtobufData({ startDay: null })).toEqual({
          extensionStartDay: { startDay: 18262 },
        })
      })
    })

    describe('isValid', () => {
      it('should be true if a valid startDay after minStartDay was provided', () => {
        expect(StartDayExtension.isValid({ startDay: new PlainDate(2020, 1, 2) })).toBeTruthy()
      })

      it('should be invalid if the provided startDay is before 1900', () => {
        expect(StartDayExtension.isValid({ startDay: new PlainDate(1899, 1, 1) })).toBeFalsy()
      })

      it('should be invalid if no startDay was provided', () => {
        expect(StartDayExtension.isValid({ startDay: null })).toBeFalsy()
      })
    })

    describe('fromString', () => {
      it('should convert a startDay string to the particular startDay extension state', () => {
        expect(StartDayExtension.fromString('10.02.1998')).toEqual({
          startDay: {
            day: 10,
            isoMonth: 2,
            isoYear: 1998,
          },
        })
      })

      it('should convert an empty string to null', () => {
        expect(StartDayExtension.fromString('')).toBeNull()
      })
    })

    describe('toString', () => {
      it('should convert a PlainDate to the particular string', () => {
        expect(StartDayExtension.toString({ startDay: new PlainDate(1998, 2, 10) })).toBe('10.02.1998')
      })

      it('should convert a null value to an empty string', () => {
        expect(StartDayExtension.toString({ startDay: null })).toBe('')
      })
    })

    describe('serialize', () => {
      it('should serialize a PlainDate to a correct ISO string', () => {
        expect(StartDayExtension.serialize({ startDay: new PlainDate(1998, 2, 10) })).toBe('1998-02-10')
      })

      it('should serialize a null value to an empty string', () => {
        expect(StartDayExtension.serialize({ startDay: null })).toBe('')
      })
    })

    describe('fromSerialized', () => {
      it('should deserialize an ISO string to a PlainDate', () => {
        expect(StartDayExtension.fromSerialized('1998-02-10')).toEqual({ startDay: new PlainDate(1998, 2, 10) })
      })

      it('should deserialize an empty string to null', () => {
        expect(StartDayExtension.fromSerialized('')).toBeNull()
      })
    })

    describe('getInitializeState', () => {
      it('should initialize startDay state with today', () => {
        expect(StartDayExtension.getInitialState()).toEqual({ startDay: new PlainDate(2024, 1, 1) })
      })
    })
  })
})
