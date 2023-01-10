import { format } from 'date-fns'
import { dateToDaysSinceEpoch, daysSinceEpochToDate } from './validityPeriod'

describe('dateToDaysSinceEpoch', () => {
  test('epoch', () => {
    expect(dateToDaysSinceEpoch(new Date('1970-01-01T00:00:00.000Z'))).toEqual(0)
  })
  test('day after epoch', () => {
    expect(dateToDaysSinceEpoch(new Date('1970-01-02T00:00:00.000Z'))).toEqual(1)
  })
  test('randomDayIsConformantWithBackend', () => {
    // Values taken from backend
    expect(dateToDaysSinceEpoch(new Date('2052-12-20T00:00:00.000Z'))).toEqual(30304)
  })
})

describe('daysSinceEpochToDate', () => {
  test('epoch', () => {
    expect(daysSinceEpochToDate(0)).toEqual(new Date('1970-01-01T00:00:00.000Z'))
  })
  test('day after epoch', () => {
    expect(daysSinceEpochToDate(1)).toEqual(new Date('1970-01-02T00:00:00.000Z'))
  })

  test('format epoch day', () => {
    expect(format(daysSinceEpochToDate(0), 'dd.MM.yyyy')).toEqual('01.01.1970')
  })

  test('format day after epoch day', () => {
    expect(format(daysSinceEpochToDate(1), 'dd.MM.yyyy')).toEqual('02.01.1970')
  })

  // A similar test exists in the backend
  test('format random day', () => {
    // 40518 is defined in day.test.js
    // "07.12.2080" is the output from day.test.js
    // These values were copied to "randomDayIsConformantWithAdministrationFrontend" and the result was verified there
    expect(format(daysSinceEpochToDate(40518), 'dd.MM.yyyy')).toEqual('07.12.2080')
  })
})
