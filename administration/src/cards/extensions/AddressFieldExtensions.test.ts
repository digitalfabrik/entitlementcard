import { AddressLine1Extension, AddressPlzExtension } from './AddressFieldExtensions'

describe('AddressExtensions', () => {
  describe('AddressPlzExtension', () => {
    it('should validate empty PLZ as valid', () => {
      const state = { addressPlz: '' }
      const result = AddressPlzExtension.isValid(state)
      expect(result).toBe(true)
    })

    it('should validate 5-digit PLZ as valid', () => {
      const state = { addressPlz: '12345' }
      const result = AddressPlzExtension.isValid(state)
      expect(result).toBe(true)
    })

    it('should validate non-5-digit PLZ as invalid', () => {
      const state = { addressPlz: '123456' }
      const result = AddressPlzExtension.isValid(state)
      expect(result).toBe(false)
    })

    it('should validate non-numeric PLZ as invalid', () => {
      const state = { addressPlz: '1234a' }
      const result = AddressPlzExtension.isValid(state)
      expect(result).toBe(false)
    })
  })

  describe('AddressLine1Extension', () => {
    it('should return empty string as initial state', () => {
      const initialState = AddressLine1Extension.getInitialState()
      expect(initialState.addressLine1).toBe('')
    })

    it('should serialize state correctly', () => {
      const state = { addressLine1: 'Test Street 123' }
      const serialized = AddressLine1Extension.serialize(state)
      expect(serialized).toBe('Test Street 123')
    })

    it('should deserialize string correctly', () => {
      const value = 'Test Street 123'
      const deserialized = AddressLine1Extension.fromSerialized(value)
      expect(deserialized?.addressLine1).toBe(value)
    })

    it('should validate null state as valid', () => {
      const result = AddressLine1Extension.isValid(null)
      expect(result).toBe(true)
    })
  })
})
