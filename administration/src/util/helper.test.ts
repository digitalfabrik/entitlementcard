import {
  containsOnlyLatinAndCommonCharset,
  containsSpecialCharacters,
  updateArrayItem,
} from './helper'

describe('containsSpecialCharacters', () => {
  it('should return true for actual special characters', () => {
    expect(containsSpecialCharacters('!')).toBe(true)
    expect(containsSpecialCharacters('@')).toBe(true)
    expect(containsSpecialCharacters('#')).toBe(true)
    expect(containsSpecialCharacters('€')).toBe(true)
    expect(containsSpecialCharacters('∑')).toBe(true)
    expect(containsSpecialCharacters('Name123')).toBe(true) // numbers
  })

  it('should return false for regular Latin characters', () => {
    expect(containsSpecialCharacters('John Doe')).toBe(false)
    expect(containsSpecialCharacters('María García')).toBe(false)
    expect(containsSpecialCharacters('Müller')).toBe(false)
  })

  it('should return false for Scandinavian characters', () => {
    expect(containsSpecialCharacters('ø')).toBe(false)
    expect(containsSpecialCharacters('Ø')).toBe(false)
    expect(containsSpecialCharacters('æ')).toBe(false)
    expect(containsSpecialCharacters('Æ')).toBe(false)
    expect(containsSpecialCharacters('å')).toBe(false)
    expect(containsSpecialCharacters('Å')).toBe(false)
    expect(containsSpecialCharacters('Søren Ågård')).toBe(false)
  })

  it('should return false for French characters', () => {
    expect(containsSpecialCharacters('œ')).toBe(false)
    expect(containsSpecialCharacters('Œ')).toBe(false)
    expect(containsSpecialCharacters('François')).toBe(false)
  })
})

describe('containsOnlyLatinAndCommonCharset', () => {
  it('should return true for basic Latin characters', () => {
    expect(containsOnlyLatinAndCommonCharset('John Doe')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('María García')).toBe(true)
  })

  it('should return true for extended Latin characters (Polish)', () => {
    expect(containsOnlyLatinAndCommonCharset('ą')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('ć')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('ę')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('ł')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('ń')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('ś')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('ź')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('ż')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('Małgorzata Kowalczyk')).toBe(true)
  })

  it('should return true for extended Latin characters (Hungarian)', () => {
    expect(containsOnlyLatinAndCommonCharset('ő')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('ű')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('Ő')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('Ű')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('Kőszegi')).toBe(true)
  })

  it('should return true for extended Latin characters (Romanian)', () => {
    expect(containsOnlyLatinAndCommonCharset('ș')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('ț')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('ă')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('Ștefan')).toBe(true)
  })

  it('should return true for extended Latin characters (Turkish)', () => {
    expect(containsOnlyLatinAndCommonCharset('ı')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('İ')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('Fatih')).toBe(true)
  })

  it('should return true for Scandinavian characters', () => {
    expect(containsOnlyLatinAndCommonCharset('ø')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('æ')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('å')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('ð')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('þ')).toBe(true)
    expect(containsOnlyLatinAndCommonCharset('Søren Ågård')).toBe(true)
  })

  it('should return false for non-Latin characters', () => {
    expect(containsOnlyLatinAndCommonCharset('Иван')).toBe(false) // Cyrillic
    expect(containsOnlyLatinAndCommonCharset('田中')).toBe(false) // Japanese
    expect(containsOnlyLatinAndCommonCharset('Ελένη')).toBe(false) // Greek
  })
})

describe('updateArrayItem', () => {
  it('should throw error if index is out of bounds', () => {
    expect(() => updateArrayItem(['asdf'], 'test', 1)).toThrow()
    expect(() => updateArrayItem(['asdf'], 'test', 5)).toThrow()
    expect(() => updateArrayItem(['asdf'], 'test', -1)).toThrow()
    expect(() => updateArrayItem(['asdf'], 'test', -5)).toThrow()
    expect(() => updateArrayItem(['asdf'], 'test', 0)).not.toThrow()
  })

  it('should update item at index', () => {
    expect(updateArrayItem(['asdf', 'qwer', 'yxcv'], 'test', 1)).toEqual(['asdf', 'test', 'yxcv'])
    expect(updateArrayItem(['asdf', 'qwer', 'yxcv'], 'test', 0)).toEqual(['test', 'qwer', 'yxcv'])
    expect(updateArrayItem([{ abc: 'def' }, { ghi: 'jkl' }, 'yxcv'], { ghi: 'uvw' }, 0)).toEqual([
      { ghi: 'uvw' },
      { ghi: 'jkl' },
      'yxcv',
    ])
    expect(updateArrayItem([{ abc: 'def' }, { ghi: 'jkl' }, 'yxcv'], { ghi: 'uvw' }, 1)).toEqual([
      { abc: 'def' },
      { ghi: 'uvw' },
      'yxcv',
    ])
    expect(updateArrayItem([{ abc: 'def' }, { ghi: 'jkl' }, 'yxcv'], { ghi: 'uvw' }, 2)).toEqual([
      { abc: 'def' },
      { ghi: 'jkl' },
      { ghi: 'uvw' },
    ])
  })
})
