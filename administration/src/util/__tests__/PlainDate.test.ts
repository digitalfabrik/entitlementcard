import PlainDate from '../PlainDate'

describe('PlainDate.toDaysSinceEpoch', () => {
  it('should be 0 for epoch', () => {
    expect(PlainDate.from('1970-01-01').toDaysSinceEpoch()).toBe(0)
  })

  it('should be 1 for the day after epoch', () => {
    expect(PlainDate.from('1970-01-02').toDaysSinceEpoch()).toBe(1)
  })

  it('should be -1 for the day before epoch', () => {
    expect(PlainDate.from('1969-12-31').toDaysSinceEpoch()).toBe(-1)
  })

  it('should be -365 for the year before epoch', () => {
    expect(PlainDate.from('1969-01-01').toDaysSinceEpoch()).toBe(-365)
  })

  it('should be conformant with the backend for a random day', () => {
    // Values taken from backend
    expect(PlainDate.from('2052-12-20').toDaysSinceEpoch()).toBe(30304)
  })
})

describe('PlainDate.fromDaysSinceEpoch', () => {
  it('should return epoch for 0', () => {
    expect(PlainDate.fromDaysSinceEpoch(0).toString()).toBe('1970-01-01')
  })

  it('should not have an off-by-one error', () => {
    const date = PlainDate.from('2024-06-29')
    expect(PlainDate.fromDaysSinceEpoch(date.toDaysSinceEpoch())).toEqual(date)
  })

  it('should return the day after epoch for 1', () => {
    expect(PlainDate.fromDaysSinceEpoch(1).toString()).toBe('1970-01-02')
  })

  it('should return the day before epoch for -1', () => {
    expect(PlainDate.fromDaysSinceEpoch(-1).toString()).toBe('1969-12-31')
  })

  it('should return the epoch day in the correct custom format for 0', () => {
    expect(PlainDate.fromDaysSinceEpoch(0).format()).toBe('01.01.1970')
  })

  it('should return the day after epoch in the correct custom format for 1', () => {
    expect(PlainDate.fromDaysSinceEpoch(1).format()).toBe('02.01.1970')
  })

  // A similar test exists in the backend
  it('should return the correct day in the correct custom format for a random day', () => {
    // These values were copied to "randomDayIsConformantWithAdministrationFrontend" and the result was verified there
    expect(PlainDate.fromDaysSinceEpoch(40518).format()).toBe('07.12.2080')
  })
})
