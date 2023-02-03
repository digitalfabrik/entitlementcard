import { format } from 'date-fns'
import { dateToDaysSinceEpoch, daysSinceEpochToDate } from './validityPeriod'

describe('dateToDaysSinceEpoch', () => {
  it('epoch', () => {
    expect(dateToDaysSinceEpoch(new Date('1970-01-01T00:00:00.000Z'))).toEqual(0)
  })
  it('day after epoch', () => {
    expect(dateToDaysSinceEpoch(new Date('1970-01-02T00:00:00.000Z'))).toEqual(1)
  })
  it('day before epoch', () => {
    expect(dateToDaysSinceEpoch(new Date('1969-12-31T00:00:00.000Z'))).toEqual(-1)
  })
  it('year before epoch', () => {
    expect(dateToDaysSinceEpoch(new Date('1969-01-01T00:00:00.000Z'))).toEqual(-365)
  })
  it('randomDayIsConformantWithBackend', () => {
    // Values taken from backend
    expect(dateToDaysSinceEpoch(new Date('2052-12-20T00:00:00.000Z'))).toEqual(30304)
  })
})

describe('daysSinceEpochToDate', () => {
  it('epoch', () => {
    expect(daysSinceEpochToDate(0)).toEqual(new Date('1970-01-01T00:00:00.000Z'))
  })
  it('day after epoch', () => {
    expect(daysSinceEpochToDate(1)).toEqual(new Date('1970-01-02T00:00:00.000Z'))
  })

  it('format epoch day', () => {
    expect(format(daysSinceEpochToDate(0), 'dd.MM.yyyy')).toEqual('01.01.1970')
  })

  it('format day after epoch day', () => {
    expect(format(daysSinceEpochToDate(1), 'dd.MM.yyyy')).toEqual('02.01.1970')
  })

  // A similar test exists in the backend
  it('format random day', () => {
    // 40518 is defined in day.test.js
    // "07.12.2080" is the output from day.test.js
    // These values were copied to "randomDayIsConformantWithAdministrationFrontend" and the result was verified there
    expect(format(daysSinceEpochToDate(40518), 'dd.MM.yyyy')).toEqual('07.12.2080')
  })
})
