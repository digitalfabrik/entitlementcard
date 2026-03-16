import { Temporal } from 'temporal-polyfill'

import {
  dateFormatterDateDefaultGerman,
  plainDateFromDaysSinceEpoch,
  plainDateToDaysSinceEpoch,
} from './date'

describe('plainDateToDaysSinceEpoch', () => {
  it('should be 0 for epoch', () => {
    expect(plainDateToDaysSinceEpoch(Temporal.PlainDate.from('1970-01-01'))).toBe(0)
  })

  it('should be 1 for the day after epoch', () => {
    expect(plainDateToDaysSinceEpoch(Temporal.PlainDate.from('1970-01-02'))).toBe(1)
  })

  it('should be -1 for the day before epoch', () => {
    expect(plainDateToDaysSinceEpoch(Temporal.PlainDate.from('1969-12-31'))).toBe(-1)
  })

  it('should be -365 for the year before epoch', () => {
    expect(plainDateToDaysSinceEpoch(Temporal.PlainDate.from('1969-01-01'))).toBe(-365)
  })

  it('should be conformant with the backend for a random day', () => {
    // Values taken from backend
    expect(plainDateToDaysSinceEpoch(Temporal.PlainDate.from('2052-12-20'))).toBe(30304)
  })
})

describe('plainDateFromDaysSinceEpoch', () => {
  it('should return epoch for 0', () => {
    expect(plainDateFromDaysSinceEpoch(0).toString()).toBe('1970-01-01')
  })

  it('should return the day after epoch for 1', () => {
    expect(plainDateFromDaysSinceEpoch(1).toString()).toBe('1970-01-02')
  })

  it('should return the day before epoch for -1', () => {
    expect(plainDateFromDaysSinceEpoch(-1).toString()).toBe('1969-12-31')
  })

  it('should return the epoch day in the correct custom format for 0', () => {
    expect(dateFormatterDateDefaultGerman.format(plainDateFromDaysSinceEpoch(0))).toBe('01.01.1970')
  })

  it('should return the day after epoch in the correct custom format for 1', () => {
    expect(dateFormatterDateDefaultGerman.format(plainDateFromDaysSinceEpoch(1))).toBe('02.01.1970')
  })

  // A similar test exists in the backend
  it('should return the correct day in the correct custom format for a random day', () => {
    // These values were copied to "randomDayIsConformantWithAdministrationFrontend" and the result was verified there
    expect(dateFormatterDateDefaultGerman.format(plainDateFromDaysSinceEpoch(40518))).toBe(
      '07.12.2080',
    )
  })
})
