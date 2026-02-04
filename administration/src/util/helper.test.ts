import {
  containsOnlyLatinAndCommonCharset,
  containsSpecialCharacters,
  updateArrayItem,
} from './helper'

describe('containsSpecialCharacters', () => {
  it.each(['!', '@', '#', '€', '∑', 'Name123'])(
    'should return true for special character: %s',
    character => {
      expect(containsSpecialCharacters(character)).toBe(true)
    },
  )

  it.each([
    'John Doe',
    'María García',
    'Müller',
    'ø',
    'Ø',
    'æ',
    'Æ',
    'å',
    'Å',
    'Søren Ågård',
    'œ',
    'Œ',
    'François',
  ])('should return false for valid name character: %s', character => {
    expect(containsSpecialCharacters(character)).toBe(false)
  })
})

describe('containsOnlyLatinAndCommonCharset', () => {
  it.each([
    'John Doe',
    'María García',
    'ą',
    'ć',
    'ę',
    'ł',
    'ń',
    'ś',
    'ź',
    'ż',
    'Małgorzata Kowalczyk',
    'ő',
    'ű',
    'Ő',
    'Ű',
    'Kőszegi',
    'ș',
    'ț',
    'ă',
    'Ștefan',
    'ı',
    'İ',
    'Fatih',
    'ø',
    'æ',
    'å',
    'ð',
    'þ',
    'Søren Ågård',
  ])('should return true for Latin character: %s', character => {
    expect(containsOnlyLatinAndCommonCharset(character)).toBe(true)
  })

  it.each([
    ['Иван', 'Cyrillic'],
    ['田中', 'Japanese'],
    ['Ελένη', 'Greek'],
  ])('should return false for non-Latin character: %s (%s)', (character, _script) => {
    expect(containsOnlyLatinAndCommonCharset(character)).toBe(false)
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
