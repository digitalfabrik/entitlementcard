import { fireEvent } from '@testing-library/react'

import { CustomRenderOptions, renderWithOptions } from '../../../testing/render'
import PlainDate from '../../../util/PlainDate'
import { maxCardValidity } from '../../constants'
import StartDayExtension, { minStartDay } from '../StartDayExtension'

const mockProvider: CustomRenderOptions = {
  router: true,
  translation: true,
  localization: true,
}
jest.useFakeTimers({ now: new Date('2024-01-01T00:00:00.000Z') })

describe('StartDayExtension', () => {
  describe('Component', () => {
    const mockSetValue = jest.fn()
    const defaultProps = {
      value: { startDay: new PlainDate(2024, 1, 1) },
      setValue: mockSetValue,
      isValid: true,
      forceError: false,
    }

    it('should render date picker with correct initial value', () => {
      const { getByDisplayValue } = renderWithOptions(<StartDayExtension.Component {...defaultProps} />, mockProvider)
      expect(getByDisplayValue('01.01.2024')).toBeTruthy()
    })

    it('should clear input when clear button is clicked', () => {
      const { getByTitle } = renderWithOptions(<StartDayExtension.Component {...defaultProps} />, mockProvider)
      const clearButton = getByTitle('Wert leeren')
      fireEvent.click(clearButton)
      expect(mockSetValue).toHaveBeenCalledWith({ startDay: null })
    })

    it('should show error message when startDay is empty and field was touched', () => {
      const { getByText, getByPlaceholderText } = renderWithOptions(
        <StartDayExtension.Component {...defaultProps} isValid={false} value={{ startDay: null }} />,
        mockProvider
      )
      const datePicker = getByPlaceholderText('TT.MM.JJJJ')
      fireEvent.blur(datePicker)
      expect(StartDayExtension.isValid({ startDay: null })).toBeFalsy()
      expect(getByText('Bitte geben Sie ein gültiges Startdatum ein.')).toBeTruthy()
    })

    it('should show error message when startDay is too far in the past and touched', () => {
      const startDay = minStartDay.subtract({ days: 1 })
      const { getByText, getByDisplayValue } = renderWithOptions(
        <StartDayExtension.Component {...defaultProps} isValid={false} value={{ startDay }} />,
        mockProvider
      )
      const datePicker = getByDisplayValue(startDay.format())
      fireEvent.blur(datePicker)
      expect(StartDayExtension.isValid({ startDay })).toBeFalsy()
      expect(
        getByText(`Das Startdatum darf nicht weiter als ${minStartDay.format()} in der Vergangenheit liegen.`)
      ).toBeTruthy()
    })

    it('should show error message when startDay is too far in the future and touched', () => {
      const today = PlainDate.fromLocalDate(new Date())
      const startDayTooFarInFuture = today.add(maxCardValidity).add({ days: 1 })
      const { getByText, getByDisplayValue } = renderWithOptions(
        <StartDayExtension.Component {...defaultProps} isValid={false} value={{ startDay: startDayTooFarInFuture }} />,
        mockProvider
      )
      const datePicker = getByDisplayValue(startDayTooFarInFuture.format())
      fireEvent.blur(datePicker)
      expect(StartDayExtension.isValid({ startDay: startDayTooFarInFuture })).toBeFalsy()
      expect(
        getByText(`Das Startdatum darf nicht weiter als ${today.add(maxCardValidity).format()} in der Zukunft liegen.`)
      ).toBeTruthy()
    })

    it('should not show error message when form is invalid but untouched', () => {
      const { queryByTestId } = renderWithOptions(
        <StartDayExtension.Component {...defaultProps} isValid={false} />,
        mockProvider
      )
      expect(StartDayExtension.isValid({ startDay: null })).toBeFalsy()
      expect(queryByTestId('form-alert')).toBeNull()
    })

    it('should not show error message when startDay is minStartDay', () => {
      const startDay = minStartDay
      const { queryByTestId, getByDisplayValue } = renderWithOptions(
        <StartDayExtension.Component {...defaultProps} value={{ startDay }} />,
        mockProvider
      )
      const datePicker = getByDisplayValue(startDay.format())
      fireEvent.blur(datePicker)
      expect(StartDayExtension.isValid({ startDay })).toBeTruthy()
      expect(queryByTestId('form-alert')).toBeNull()
    })

    it('should call setValue when date is changed', () => {
      const { getByDisplayValue } = renderWithOptions(<StartDayExtension.Component {...defaultProps} />, mockProvider)
      const startDayChanged = new PlainDate(2025, 1, 2)
      const datePicker = getByDisplayValue('01.01.2024')
      fireEvent.change(datePicker, { target: { value: startDayChanged.format() } })
      expect(mockSetValue).toHaveBeenCalledWith({ startDay: startDayChanged })
    })

    it('should set startDay to null if no valid date was typed in', () => {
      const { getByDisplayValue } = renderWithOptions(<StartDayExtension.Component {...defaultProps} />, mockProvider)
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
          extensionStartDay: { startDay: minStartDay.toDaysSinceEpoch() },
        })
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
        expect(StartDayExtension.getInitialState()).toEqual({ startDay: PlainDate.fromLocalDate(new Date()) })
      })
    })
  })
})
