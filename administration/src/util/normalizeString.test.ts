import normalizeString, { normalizeName } from './normalizeString'

describe('normalizeString', () => {
  it('should normalize search string', () => {
    expect(normalizeString('Donauwörth')).toBe('donauworth')
    expect(normalizeString('äöUEJJ')).toBe('aouejj')
    expect(normalizeString('äöUEJJß')).toBe('aouejj')
  })

  it('should trim whitespaces', () => {
    expect(normalizeString('   test  ')).toBe('test')
  })
})

describe('normalizeName', () => {
  it('should normalize search string', () => {
    expect(normalizeName('Dr. Hans-Peter Müller Lüdenscheid  ')).toBe(
      'drhanspetermullerludenscheid',
    )
    expect(normalizeName('Dr. Hans Peter Müller Lüdenscheid')).toBe('drhanspetermullerludenscheid')
  })
})
