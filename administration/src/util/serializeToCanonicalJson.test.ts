import serializeToCanonicalJson from './serializeToCanonicalJson'

describe('serializeToCanonicalJson', () => {
  it('empty array', () => {
    const input: unknown[] = []
    const expected = '[]'
    const actual = serializeToCanonicalJson(input)

    expect(actual).toEqual(expected)
  })

  it('one element array', () => {
    const input = [123]
    const expected = '[123]'
    const actual = serializeToCanonicalJson(input)

    expect(actual).toEqual(expected)
  })

  it('multi element array', () => {
    const input = [123, 456, 'hello']
    const expected = '[123,456,"hello"]'
    const actual = serializeToCanonicalJson(input)

    expect(actual).toEqual(expected)
  })

  // This test was modified (one undefined array entry was replaced by null)
  it('null values in array', () => {
    const input = [null, null, 'hello']
    const expected = '[null,null,"hello"]'
    const actual = serializeToCanonicalJson(input)

    expect(actual).toEqual(expected)
  })

  // This test was created
  it('undefined values in array', () => {
    const input = [null, undefined, 'hello']

    expect(() => serializeToCanonicalJson(input)).toThrow()
  })

  it('object in array', () => {
    const input = [{ b: 123, a: 'string' }]
    const expected = '[{"a":"string","b":123}]'
    const actual = serializeToCanonicalJson(input)

    expect(actual).toEqual(expected)
  })

  it('empty object', () => {
    const input = {}
    const expected = '{}'
    const actual = serializeToCanonicalJson(input)

    expect(actual).toEqual(expected)
  })

  // This test was modified to expect an error
  it('object with undefined value', () => {
    const input = { test: undefined }

    expect(() => serializeToCanonicalJson(input)).toThrow()
  })

  it('object with null value', () => {
    const input = { test: null }
    const expected = '{"test":null}'
    const actual = serializeToCanonicalJson(input)

    expect(actual).toEqual(expected)
  })

  it('object with one property', () => {
    const input = { hello: 'world' }
    const expected = '{"hello":"world"}'
    const actual = serializeToCanonicalJson(input)

    expect(actual).toEqual(expected)
  })

  it('object with more than one property', () => {
    const input = { hello: 'world', number: 123 }
    const expected = '{"hello":"world","number":123}'
    const actual = serializeToCanonicalJson(input)

    expect(actual).toEqual(expected)
  })

  // This test was modified to expect an error
  it('undefined should throw', () => {
    const input = undefined

    expect(() => serializeToCanonicalJson(input)).toThrow()
  })

  it('null', () => {
    const input = null
    const expected = 'null'
    const actual = serializeToCanonicalJson(input)

    expect(actual).toEqual(expected)
  })

  // This test was modified to expect an error
  it('symbol should throw', () => {
    const input = Symbol('hello world')

    expect(() => serializeToCanonicalJson(input)).toThrow()
  })

  it('object with symbol value should throw', () => {
    const input = { test: Symbol('hello world') }

    expect(() => serializeToCanonicalJson(input)).toThrow()
  })

  it('object with number key', () => {
    const input = { 42: 'foo' }
    const expected = '{"42":"foo"}'
    const actual = serializeToCanonicalJson(input)

    expect(actual).toEqual(expected)
  })

  it('object with symbol key', () => {
    const input = { [Symbol('hello world')]: 'foo' }
    const expected = '{}'
    const actual = serializeToCanonicalJson(input)

    expect(actual).toEqual(expected)
  })

  it('object with toJSON', () => {
    const input = {
      a: 123,
      b: 456,
      toJSON: function () {
        return {
          b: this.b,
          a: this.a,
        }
      },
    }
    const expected = '{"a":123,"b":456}'
    const actual = serializeToCanonicalJson(input)

    expect(actual).toEqual(expected)
  })
})
