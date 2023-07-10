import BavariaCardTypeExtension from './BavariaCardTypeExtension'

describe('BavariaCardTypeExtension', () => {
  it('should correctly set card type', () => {
    const testPairs = [
      ['Goldkarte', 'Goldkarte'],
      ['Standard', 'Standard'],
      ['gold', 'Goldkarte'],
      ['blau', 'Standard'],
      ['blaugold', ''],
    ]

    testPairs.forEach(([input, expected]) => {
      const extension = new BavariaCardTypeExtension()
      extension.fromString(input)
      expect(extension.toString()).toBe(expected)
    })
  })
})
