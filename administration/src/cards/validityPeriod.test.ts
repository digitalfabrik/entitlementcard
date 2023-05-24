import { format } from 'date-fns'

import { dateToDaysSinceEpoch, daysSinceEpochToDate } from './validityPeriod'

describe('dateToDaysSinceEpoch', () => {
  it('should be 0 for epoch', () => {
    expect(dateToDaysSinceEpoch(new Date('1970-01-01T00:00:00.000Z'))).toBe(0)
  })

  it('should be 1 for the day after epoch', () => {
    expect(dateToDaysSinceEpoch(new Date('1970-01-02T00:00:00.000Z'))).toBe(1)
  })

  it('should be -1 for the day before epoch', () => {
    expect(dateToDaysSinceEpoch(new Date('1969-12-31T00:00:00.000Z'))).toBe(-1)
  })

  it('should be -365 for the year before epoch', () => {
    expect(dateToDaysSinceEpoch(new Date('1969-01-01T00:00:00.000Z'))).toBe(-365)
  })

  it('should be conformant with the backend for a random day', () => {
    // Values taken from backend
    expect(dateToDaysSinceEpoch(new Date('2052-12-20T00:00:00.000Z'))).toBe(30304)
  })
})

describe('daysSinceEpochToDate', () => {
  it('should return epoch for 0', () => {
    expect(daysSinceEpochToDate(0)).toEqual(new Date('1970-01-01T00:00:00.000Z'))
  })

  it('should return the day after epoch for 1', () => {
    expect(daysSinceEpochToDate(1)).toEqual(new Date('1970-01-02T00:00:00.000Z'))
  })

  it('should return the epoch day in the correct format using date-fns for 0', () => {
    expect(format(daysSinceEpochToDate(0), 'dd.MM.yyyy')).toBe('01.01.1970')
  })

  it('should return the day after epoch in the correct format using date-fns for 1', () => {
    expect(format(daysSinceEpochToDate(1), 'dd.MM.yyyy')).toBe('02.01.1970')
  })

  // A similar test exists in the backend
  it('should return the correct day in the correct format using date-fns for a random day', () => {
    // 40518 is defined in day.test.js
    // "07.12.2080" is the output from day.test.js
    // These values were copied to "randomDayIsConformantWithAdministrationFrontend" and the result was verified there
    expect(format(daysSinceEpochToDate(40518), 'dd.MM.yyyy')).toBe('07.12.2080')
  })
})
