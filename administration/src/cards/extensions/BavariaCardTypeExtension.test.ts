import BavariaCardTypeExtension from './BavariaCardTypeExtension'

describe('BavariaCardTypeExtension', () => {
  it('should correctly set card type', () => {
    const testPairs: [string, string | undefined][] = [
      ['Goldkarte', 'Goldkarte'],
      ['Standard', 'Standard'],
      ['gold', 'Goldkarte'],
      ['blau', 'Standard'],
      ['blaugold', undefined],
    ]

    testPairs.forEach(([input, expected]) => {
      expect(BavariaCardTypeExtension.fromString(input)?.bavariaCardType).toBe(expected)
    })
  })
})
