import { fireEvent } from '@testing-library/react'

import koblenzConfig from '../../../project-configs/koblenz/config'
import nuernbergConfig from '../../../project-configs/nuernberg/config'
import { CustomRenderOptions, renderWithOptions } from '../../../testing/render'
import PlainDate from '../../../util/PlainDate'
import BirthdayExtension, { minBirthday } from '../BirthdayExtension'

jest.useFakeTimers({ now: new Date('2024-01-01T00:00:00.000Z') })
const setValue = jest.fn()

const mockProvider: CustomRenderOptions = {
  router: true,
  translation: true,
  localization: true,
}

describe('BirthdayExtension', () => {
  const today = PlainDate.fromLocalDate(new Date())
  describe('Component', () => {
    it('should display correct placeholder if no birthday is provided', () => {
      const { getByPlaceholderText } = renderWithOptions(
        <BirthdayExtension.Component forceError setValue={setValue} isValid={false} value={{ birthday: null }} />,
        mockProvider
      )
      expect(getByPlaceholderText('TT.MM.JJJJ')).toBeTruthy()
    })

    it('should clear input when clear button is clicked', () => {
      const { getByTitle } = renderWithOptions(
        <BirthdayExtension.Component
          forceError
          setValue={setValue}
          isValid={false}
          value={{ birthday: new PlainDate(1955, 1, 1) }}
        />,
        mockProvider
      )
      const clearButton = getByTitle('Wert leeren')
      fireEvent.click(clearButton)
      expect(setValue).toHaveBeenCalledWith({ birthday: null })
    })

    it('should show error if no birthday is provided and forceError is true', () => {
      const { getByText } = renderWithOptions(
        <BirthdayExtension.Component forceError setValue={setValue} isValid={false} value={{ birthday: null }} />,
        mockProvider
      )
      expect(BirthdayExtension.isValid({ birthday: null })).toBeFalsy()
      expect(getByText('Bitte geben Sie ein gültiges Geburtsdatum an.')).toBeTruthy()
    })

    it('should not show error if no birthday is provided and forceError is false', () => {
      const { queryByTestId } = renderWithOptions(
        <BirthdayExtension.Component
          forceError={false}
          setValue={setValue}
          isValid={false}
          value={{ birthday: null }}
        />,
        mockProvider
      )
      expect(BirthdayExtension.isValid({ birthday: null })).toBeFalsy()
      expect(queryByTestId('form-alert')).toBeNull()
    })

    it('should show error if no birthday is provided, forceError is false and user left field', () => {
      const { getByText, getByPlaceholderText } = renderWithOptions(
        <BirthdayExtension.Component
          forceError={false}
          setValue={setValue}
          isValid={false}
          value={{ birthday: null }}
        />,
        mockProvider
      )
      const datePicker = getByPlaceholderText('TT.MM.JJJJ')
      fireEvent.blur(datePicker)
      expect(BirthdayExtension.isValid({ birthday: null })).toBeFalsy()
      expect(getByText('Bitte geben Sie ein gültiges Geburtsdatum an.')).toBeTruthy()
    })

    it('should show error if provided birthday is too far in the past', () => {
      const birthDayTooFarInPast = minBirthday.subtract({ days: 1 })
      const { getByText } = renderWithOptions(
        <BirthdayExtension.Component
          forceError
          setValue={setValue}
          isValid={false}
          value={{ birthday: birthDayTooFarInPast }}
        />,
        mockProvider
      )
      expect(BirthdayExtension.isValid({ birthday: birthDayTooFarInPast })).toBeFalsy()
      expect(getByText('Das Geburtsdatum darf nicht vor dem 01.01.1900 liegen.')).toBeTruthy()
    })

    it('should not show error if provided birthday is today', () => {
      const { queryByTestId } = renderWithOptions(
        <BirthdayExtension.Component forceError setValue={setValue} isValid={false} value={{ birthday: today }} />,
        mockProvider
      )
      expect(BirthdayExtension.isValid({ birthday: today })).toBeTruthy()
      expect(queryByTestId('form-alert')).toBeNull()
    })

    it('should not show error if provided birthday is minBirthday', () => {
      const { queryByTestId } = renderWithOptions(
        <BirthdayExtension.Component
          forceError
          setValue={setValue}
          isValid={false}
          value={{ birthday: minBirthday }}
        />,
        mockProvider
      )
      expect(BirthdayExtension.isValid({ birthday: minBirthday })).toBeTruthy()
      expect(queryByTestId('form-alert')).toBeNull()
    })

    it('should not show error if a correct birthday is provided', () => {
      const birthday = new PlainDate(2020, 1, 1)
      const { queryByTestId } = renderWithOptions(
        <BirthdayExtension.Component forceError setValue={setValue} isValid={false} value={{ birthday }} />,
        mockProvider
      )
      expect(BirthdayExtension.isValid({ birthday })).toBeTruthy()
      expect(queryByTestId('form-alert')).toBeNull()
    })

    it('should show error if provided birthday is in the future', () => {
      const tomorrow = PlainDate.fromLocalDate(new Date()).add({ days: 1 })
      const { getByText } = renderWithOptions(
        <BirthdayExtension.Component forceError setValue={setValue} isValid={false} value={{ birthday: tomorrow }} />,
        mockProvider
      )
      expect(BirthdayExtension.isValid({ birthday: tomorrow })).toBeFalsy()
      expect(getByText('Das Geburtsdatum darf nicht in der Zukunft liegen.')).toBeTruthy()
    })

    it('should show an underage hint if provided birthday is today for koblenz', () => {
      const { getByText } = renderWithOptions(
        <BirthdayExtension.Component forceError setValue={setValue} isValid value={{ birthday: today }} />,
        { ...mockProvider, projectConfig: koblenzConfig }
      )
      expect(BirthdayExtension.isValid({ birthday: today })).toBeTruthy()
      expect(
        getByText(
          'Bei Minderjährigen unter 16 Jahren darf der KoblenzPass nur mit Einverständnis der Erziehungsberechtigten abgerufen werden.'
        )
      ).toBeTruthy()
    })

    it('should show a hint if provided birthday is underage for koblenz', () => {
      const underAgeBirthday = today.subtract({ years: 16 }).add({ days: 1 })
      const { getByText } = renderWithOptions(
        <BirthdayExtension.Component forceError setValue={setValue} isValid value={{ birthday: underAgeBirthday }} />,
        { ...mockProvider, projectConfig: koblenzConfig }
      )
      expect(BirthdayExtension.isValid({ birthday: underAgeBirthday })).toBeTruthy()
      expect(
        getByText(
          'Bei Minderjährigen unter 16 Jahren darf der KoblenzPass nur mit Einverständnis der Erziehungsberechtigten abgerufen werden.'
        )
      ).toBeTruthy()
    })

    it('should not show a hint if provided birthday is underage for nuernberg', () => {
      const { queryByText } = renderWithOptions(
        <BirthdayExtension.Component
          forceError
          setValue={setValue}
          isValid={false}
          value={{ birthday: new PlainDate(2020, 1, 1) }}
        />,
        { ...mockProvider, projectConfig: nuernbergConfig }
      )
      expect(
        queryByText(
          'Bei Minderjährigen unter 16 Jahren darf der KoblenzPass nur mit Einverständnis der Erziehungsberechtigten abgerufen werden.'
        )
      ).toBeNull()
    })

    it('should not show a hint when person turns 16 today', () => {
      const notUnderageBirthday = today.subtract({ years: 16 })
      const { queryByText } = renderWithOptions(
        <BirthdayExtension.Component
          forceError
          setValue={setValue}
          isValid={false}
          value={{ birthday: notUnderageBirthday }}
        />,
        { ...mockProvider, projectConfig: koblenzConfig }
      )
      expect(
        queryByText(
          'Bei Minderjährigen unter 16 Jahren darf der KoblenzPass nur mit Einverständnis der Erziehungsberechtigten abgerufen werden.'
        )
      ).toBeNull()
    })

    it('should call setValue when date is changed', () => {
      const { getByPlaceholderText } = renderWithOptions(
        <BirthdayExtension.Component forceError setValue={setValue} isValid={false} value={{ birthday: null }} />,
        mockProvider
      )
      const datePicker = getByPlaceholderText('TT.MM.JJJJ')

      fireEvent.change(datePicker, { target: { value: '02.01.2025' } })
      expect(setValue).toHaveBeenCalledWith({ birthday: { day: 2, isoMonth: 1, isoYear: 2025 } })
    })
  })

  describe('getProtobufData', () => {
    it('should result in correct days since epoch 1970', () => {
      expect(BirthdayExtension.getProtobufData({ birthday: new PlainDate(2020, 1, 1) })).toEqual({
        extensionBirthday: { birthday: 18262 },
      })
    })

    it('should result undefined if no birthday is provided', () => {
      expect(BirthdayExtension.getProtobufData({ birthday: null })).toEqual({
        extensionBirthday: { birthday: undefined },
      })
    })
  })

  describe('fromString', () => {
    it('should convert a birthday string to the particular birthday extension state', () => {
      expect(BirthdayExtension.fromString('10.02.1998')).toEqual({ birthday: { day: 10, isoMonth: 2, isoYear: 1998 } })
    })

    it('should convert an empty string to null', () => {
      expect(BirthdayExtension.fromString('')).toBeNull()
    })
  })

  describe('toString', () => {
    it('should convert a PlainDate to the particular string', () => {
      expect(BirthdayExtension.toString({ birthday: new PlainDate(1998, 2, 10) })).toBe('10.02.1998')
    })

    it('should convert a null value to an empty string', () => {
      expect(BirthdayExtension.toString({ birthday: null })).toBe('')
    })
  })

  describe('serialize', () => {
    it('should serialize a PlainDate to a correct ISO string', () => {
      expect(BirthdayExtension.serialize({ birthday: new PlainDate(1998, 2, 10) })).toBe('1998-02-10')
    })

    it('should serialize a null value to an empty string', () => {
      expect(BirthdayExtension.serialize({ birthday: null })).toBe('')
    })
  })

  describe('fromSerialized', () => {
    it('should deserialize an ISO string to a PlainDate', () => {
      expect(BirthdayExtension.fromSerialized('1998-02-10')).toEqual({ birthday: new PlainDate(1998, 2, 10) })
    })

    it('should deserialize an empty string to null', () => {
      expect(BirthdayExtension.fromSerialized('')).toBeNull()
    })
  })

  describe('getInitializeState', () => {
    it('should initialize birthday state with null', () => {
      expect(BirthdayExtension.getInitialState()).toEqual({ birthday: null })
    })
  })

  describe('Extension name', () => {
    it('should not change to ensure correct user hashes for koblenz project', () => {
      expect(BirthdayExtension.name).toBe('birthday')
    })
  })
})
