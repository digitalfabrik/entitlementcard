import { mockRegion } from '../../__mocks__/mockRegion'
import RegionExtension from '../RegionExtension'

describe('RegionExtension', () => {
  it('should get correct initial state from region', () => {
    const initialState = RegionExtension.getInitialState(mockRegion)
    expect(initialState).toEqual({ regionId: mockRegion.id })
  })

  it('should correctly convert state to protobuf data', () => {
    const state = { regionId: mockRegion.id }
    const protobufData = RegionExtension.getProtobufData(state)
    expect(protobufData).toEqual({
      extensionRegion: {
        regionId: mockRegion.id,
      },
    })
  })

  it('should correctly convert string to state', () => {
    const result = RegionExtension.fromString('789')
    expect(result).toEqual({ regionId: 789 })
  })

  it('should correctly convert state to string', () => {
    const state = { regionId: 789 }
    const result = RegionExtension.serialize(state)
    expect(result).toBe('789')
  })

  it('should always be valid', () => {
    const state = { regionId: 789 }
    expect(RegionExtension.isValid(state)).toBe(true)
  })

  it('should not cause infinite lifetime', () => {
    const state = { regionId: 789 }
    expect(RegionExtension.causesInfiniteLifetime(state)).toBe(false)
  })

  it('should be mandatory', () => {
    expect(RegionExtension.isMandatory).toBe(true)
  })
})
