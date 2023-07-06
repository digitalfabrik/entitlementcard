import BavariaCardTypeExtension from './BavariaCardTypeExtension'

describe('BavariaCardTypeExtension', () => {
  it('should correctly set card type', () => {})

  // @ts-ignore
  it.each`
    input          | expected
    ${'Goldkarte'} | ${'Goldkarte'}
    ${'Standard'}  | ${'Standard'}
    ${'gold'}      | ${'Goldkarte'}
    ${'blau'}      | ${'Standard'}
    ${'blaugold'}  | ${''}
  `('should correctly set card type', ({ input, expected }: { input: string; expected: string }) => {
    const extension = new BavariaCardTypeExtension()
    extension.fromString(input)
    expect(extension.toString()).toBe(expected)
  })
})
