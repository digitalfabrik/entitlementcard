import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import React, { ReactNode } from 'react'

import { AppToasterProvider } from '../../../bp-modules/AppToaster'
import koblenzConfig from '../../../project-configs/koblenz/config'
import { renderWithTranslation } from '../../../testing/render'
import PlainDate from '../../../util/PlainDate'
import BirthdayExtension from '../BirthdayExtension'

const wrapper = ({ children }: { children: ReactNode }) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <AppToasterProvider>{children}</AppToasterProvider>
  </LocalizationProvider>
)

jest.useFakeTimers({ now: new Date('2024-01-01T00:00:00.000Z') })
describe('BirthdayExtension', () => {
  describe('Component', () => {
    it('should display correct placeholder if no birthday is provided', () => {
      const setValue = jest.fn()
      const { getByPlaceholderText } = renderWithTranslation(
        <BirthdayExtension.Component showRequired setValue={setValue} isValid={false} value={{ birthday: null }} />,
        { wrapper }
      )
      expect(getByPlaceholderText('TT.MM.JJJJ')).toBeTruthy()
    })

    it('should show error if no birthday is provided', () => {
      const setValue = jest.fn()
      const { getByText } = renderWithTranslation(
        <BirthdayExtension.Component showRequired setValue={setValue} isValid={false} value={{ birthday: null }} />,
        { wrapper }
      )
      expect(getByText('Bitte geben Sie ein gültiges Geburtsdatum an.')).toBeTruthy()
    })

    it('should show error if provided birthday is in the future', () => {
      const setValue = jest.fn()
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const { getByText } = renderWithTranslation(
        <BirthdayExtension.Component
          showRequired
          setValue={setValue}
          isValid={false}
          value={{ birthday: PlainDate.fromLocalDate(tomorrow) }}
        />,
        { wrapper }
      )
      expect(getByText('Das Geburtsdatum darf nicht in der Zukunft liegen.')).toBeTruthy()
    })

    it('should show an hint if provided birthday is underage', () => {
      const setValue = jest.fn()
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const { getByText } = renderWithTranslation(
        <BirthdayExtension.Component
          showRequired
          setValue={setValue}
          isValid={false}
          value={{ birthday: new PlainDate(2020, 1, 1) }}
        />,
        { wrapper, projectConfig: koblenzConfig }
      )
      expect(
        getByText(
          'Bei Minderjährigen unter 16 Jahren darf der KoblenzPass nur mit Einverständnis der Erziehungsberechtigten abgerufen werden.'
        )
      ).toBeTruthy()
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

  describe('isValid', () => {
    it('should be true if a valid birthday was provided', () => {
      expect(BirthdayExtension.isValid({ birthday: new PlainDate(2020, 1, 1) })).toBeTruthy()
    })

    it('should be invalid if the provided birthday is before 1900', () => {
      expect(BirthdayExtension.isValid({ birthday: new PlainDate(1899, 1, 1) })).toBeFalsy()
    })

    it('should be invalid if no birthday was provided', () => {
      expect(BirthdayExtension.isValid({ birthday: null })).toBeFalsy()
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
})
