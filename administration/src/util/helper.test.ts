import { updateArrayItem } from './helper'

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
