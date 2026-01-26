import { splitStreetAndHouseNumber } from './splitStreetAndHouseNumber'

describe('splitStreetAndHouseNumber', () => {
  describe('Null and undefined handling', () => {
    it('should return empty strings when input is null', () => {
      const result = splitStreetAndHouseNumber(null)
      expect(result.street).toBe('')
      expect(result.houseNumber).toBe('')
    })

    it('should return empty strings when input is undefined', () => {
      const result = splitStreetAndHouseNumber(undefined)
      expect(result.street).toBe('')
      expect(result.houseNumber).toBe('')
    })
  })

  describe('Simple house numbers', () => {
    it('should split simple street and house number correctly', () => {
      const result = splitStreetAndHouseNumber('Main Street 123')
      expect(result.street).toBe('Main Street')
      expect(result.houseNumber).toBe('123')
    })

    it('should split street with house number 1', () => {
      const result = splitStreetAndHouseNumber('Hauptstraße 1')
      expect(result.street).toBe('Hauptstraße')
      expect(result.houseNumber).toBe('1')
    })

    it('should split street with large house number', () => {
      const result = splitStreetAndHouseNumber('Oak Road 99999')
      expect(result.street).toBe('Oak Road')
      expect(result.houseNumber).toBe('99999')
    })
  })

  describe('House numbers with letters', () => {
    it('should split street and house number with trailing letter', () => {
      const result = splitStreetAndHouseNumber('Main Street 123a')
      expect(result.street).toBe('Main Street')
      expect(result.houseNumber).toBe('123a')
    })

    it('should split street and house number with uppercase letter', () => {
      const result = splitStreetAndHouseNumber('Main Street 123B')
      expect(result.street).toBe('Main Street')
      expect(result.houseNumber).toBe('123B')
    })

    it('should split street and house number with space before letter', () => {
      const result = splitStreetAndHouseNumber('Main Street 123 a')
      expect(result.street).toBe('Main Street')
      expect(result.houseNumber).toBe('123 a')
    })
  })

  describe('House numbers with ranges', () => {
    it('should split street and house number with hyphen range', () => {
      const result = splitStreetAndHouseNumber('Main Street 5-7')
      expect(result.street).toBe('Main Street')
      expect(result.houseNumber).toBe('5-7')
    })

    it('should split street and house number with slash range', () => {
      const result = splitStreetAndHouseNumber('Main Street 10/12')
      expect(result.street).toBe('Main Street')
      expect(result.houseNumber).toBe('10/12')
    })

    it('should split street and house number with space around hyphen', () => {
      const result = splitStreetAndHouseNumber('Main Street 5 - 7')
      expect(result.street).toBe('Main Street')
      expect(result.houseNumber).toBe('5 - 7')
    })

    it('should split street and house number with space around slash', () => {
      const result = splitStreetAndHouseNumber('Main Street 10 / 12')
      expect(result.street).toBe('Main Street')
      expect(result.houseNumber).toBe('10 / 12')
    })
  })

  describe('Complex house numbers', () => {
    it('should split street and house number with letter after range', () => {
      const result = splitStreetAndHouseNumber('Main Street 5-7a')
      expect(result.street).toBe('Main Street')
      expect(result.houseNumber).toBe('5-7a')
    })

    it('should split street and house number with empty spaces between numbers', () => {
      const result = splitStreetAndHouseNumber('Richard-Wagner-Platz 2a - 10a')
      expect(result.street).toBe('Richard-Wagner-Platz')
      expect(result.houseNumber).toBe('2a - 10a')
    })

    it('should split street and house number with fraction', () => {
      const result = splitStreetAndHouseNumber('Main Street 13 1/2')
      expect(result.street).toBe('Main Street')
      expect(result.houseNumber).toBe('13 1/2')
    })

    it('should split street and house number with multiple spaces', () => {
      const result = splitStreetAndHouseNumber('Main Street   123')
      expect(result.street).toBe('Main Street')
      expect(result.houseNumber).toBe('123')
    })
  })

  describe('Street names with special characters', () => {
    it('should split street with umlaut and house number', () => {
      const result = splitStreetAndHouseNumber('Hauptstraße 42')
      expect(result.street).toBe('Hauptstraße')
      expect(result.houseNumber).toBe('42')
    })

    it('should split street with hyphen and house number', () => {
      const result = splitStreetAndHouseNumber('Main-Street 99')
      expect(result.street).toBe('Main-Street')
      expect(result.houseNumber).toBe('99')
    })

    it('should split street with slash and house number', () => {
      const result = splitStreetAndHouseNumber('Street/Avenue 55')
      expect(result.street).toBe('Street/Avenue')
      expect(result.houseNumber).toBe('55')
    })

    it('should split street with multiple words and house number', () => {
      const result = splitStreetAndHouseNumber('Long Street Name Here 101')
      expect(result.street).toBe('Long Street Name Here')
      expect(result.houseNumber).toBe('101')
    })
  })

  describe('Edge cases without clear house number', () => {
    it('should return full address as street when no house number pattern found', () => {
      const result = splitStreetAndHouseNumber('Main Street')
      expect(result.street).toBe('Main Street')
      expect(result.houseNumber).toBe('')
    })

    it('should return full address as street when only letters present', () => {
      const result = splitStreetAndHouseNumber('Main Street ABC')
      expect(result.street).toBe('Main Street ABC')
      expect(result.houseNumber).toBe('')
    })

    it('should handle empty string input', () => {
      const result = splitStreetAndHouseNumber('')
      expect(result.street).toBe('')
      expect(result.houseNumber).toBe('')
    })

    it('should handle whitespace only input', () => {
      const result = splitStreetAndHouseNumber('   ')
      expect(result.street).toBe('')
      expect(result.houseNumber).toBe('')
    })
  })
})
