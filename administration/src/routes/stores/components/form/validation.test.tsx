import { AcceptingStoreFormData } from '../../types'
import {
  categoryValidation,
  cityValidation,
  coordinatesInvalid,
  descriptionValidation,
  emailValidation,
  homepageValidation,
  houseNumberValidation,
  isStoreFormInvalid,
  nameValidation,
  phoneValidation,
  postalCodeValidation,
  streetValidation,
} from './validation'

describe('Store Form Validation', () => {
  describe('nameValidation', () => {
    it('should return required error when name is undefined', () => {
      const result = nameValidation(undefined)
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return required error when name is empty string', () => {
      const result = nameValidation('')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return required error when name contains only whitespace', () => {
      const result = nameValidation('   ')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return length error when name is too short', () => {
      const result = nameValidation('ab')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return length error when name exceeds max length', () => {
      const result = nameValidation('a'.repeat(151))
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return valid when name has minimum length', () => {
      const result = nameValidation('abc')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid when name has maximum length', () => {
      const result = nameValidation('a'.repeat(150))
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for valid name with special characters', () => {
      const result = nameValidation('Café München GmbH')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should trim whitespace from name', () => {
      const result = nameValidation('  Valid Name  ')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })
  })

  describe('streetValidation', () => {
    it('should return required error when street is undefined', () => {
      const result = streetValidation(undefined)
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return required error when street is empty', () => {
      const result = streetValidation('')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return length error when street is too short', () => {
      const result = streetValidation('ab')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return length error when street exceeds max length', () => {
      const result = streetValidation('a'.repeat(101))
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return special character error when street contains invalid characters', () => {
      const result = streetValidation('Straße@Hotel')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return allow numbers in street name', () => {
      const result = streetValidation('Straße des 20.Juli')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for valid street name', () => {
      const result = streetValidation('Hauptstraße')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for street with hyphen', () => {
      const result = streetValidation('Main-Straße')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for street with slash', () => {
      const result = streetValidation('Straße/Allee')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for street with parentheses', () => {
      const result = streetValidation('Straße (alt)')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for street with comma', () => {
      const result = streetValidation('Straße, Allee')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for street with dot', () => {
      const result = streetValidation('Str.')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for street with maximum length', () => {
      const result = streetValidation('A'.repeat(100))
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })
  })

  describe('houseNumberValidation', () => {
    it('should return required error when house number is undefined', () => {
      const result = houseNumberValidation(undefined)
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return required error when house number is empty', () => {
      const result = houseNumberValidation('')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return length error when house number exceeds max length', () => {
      const result = houseNumberValidation('12345678901')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return invalid for not including a number', () => {
      const result = houseNumberValidation('abc')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return valid for simple house number', () => {
      const result = houseNumberValidation('123')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for house number with letter', () => {
      const result = houseNumberValidation('123a')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for house number with letter and space', () => {
      const result = houseNumberValidation('123 a')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for house number with range using hyphen', () => {
      const result = houseNumberValidation('5-7')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for house number with range using plus', () => {
      const result = houseNumberValidation('2+3')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for house number with fraction', () => {
      const result = houseNumberValidation('13 1/2')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for house number with maximum length', () => {
      const result = houseNumberValidation('1234567890')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })
  })

  describe('phoneValidation', () => {
    it('should return valid when phone is undefined', () => {
      const result = phoneValidation(undefined)
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid when phone is empty', () => {
      const result = phoneValidation('')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return length error when phone exceeds max length', () => {
      const result = phoneValidation('1'.repeat(101))
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return special character error for invalid phone format', () => {
      const result = phoneValidation('abc123')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return valid for simple phone number', () => {
      const result = phoneValidation('0123456789')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for phone number with plus prefix', () => {
      const result = phoneValidation('+49123456789')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for phone number with hyphen separator', () => {
      const result = phoneValidation('01234-56789')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for phone number with space separator', () => {
      const result = phoneValidation('01234 56789')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for phone number with slash separator', () => {
      const result = phoneValidation('01234/56789')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for phone number with dot separator', () => {
      const result = phoneValidation('01234.56789')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })
  })

  describe('emailValidation', () => {
    it('should return valid when email is undefined', () => {
      const result = emailValidation(undefined)
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid when email is empty', () => {
      const result = emailValidation('')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return length error when email exceeds max length', () => {
      const result = emailValidation('a'.repeat(101))
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return special character error for invalid email format', () => {
      const result = emailValidation('invalid-email')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return valid for valid email', () => {
      const result = emailValidation('test@example.com')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for email with plus sign', () => {
      const result = emailValidation('test+tag@example.com')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for email with subdomain', () => {
      const result = emailValidation('test@mail.example.com')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })
  })

  describe('cityValidation', () => {
    it('should return required error when city is undefined', () => {
      const result = cityValidation(undefined)
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return required error when city is empty', () => {
      const result = cityValidation('')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return length error when city is too short', () => {
      const result = cityValidation('ab')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return length error when city exceeds max length', () => {
      const result = cityValidation('a'.repeat(101))
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return special character error when city contains numbers', () => {
      const result = cityValidation('München123')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return valid for valid city name', () => {
      const result = cityValidation('München')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for city with hyphen', () => {
      const result = cityValidation('Bad-Homburg')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for city with space', () => {
      const result = cityValidation('New York')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for city with apostrophe', () => {
      const result = cityValidation("Saint-Jean d'Angély")
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })
  })

  describe('homepageValidation', () => {
    it('should return valid when homepage is undefined', () => {
      const result = homepageValidation(undefined)
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid when homepage is empty', () => {
      const result = homepageValidation('')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return length error when homepage exceeds max length', () => {
      const result = homepageValidation(`https://${'a'.repeat(194)}`)
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return URL error for invalid URL without protocol', () => {
      const result = homepageValidation('example.com')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return URL error for URL without double slash', () => {
      const result = homepageValidation('http:example.com')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return URL error for malformed URL', () => {
      const result = homepageValidation('not a url')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return valid for valid HTTP URL', () => {
      const result = homepageValidation('http://example.com')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for valid HTTPS URL', () => {
      const result = homepageValidation('https://example.com')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for URL with path', () => {
      const result = homepageValidation('https://example.com/path')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for URL with subdomain', () => {
      const result = homepageValidation('https://www.example.com')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })
  })

  describe('postalCodeValidation', () => {
    it('should return required error when postal code is undefined', () => {
      const result = postalCodeValidation(undefined)
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return required error when postal code is empty', () => {
      const result = postalCodeValidation('')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return length error when postal code is too short', () => {
      const result = postalCodeValidation('1234')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return length error when postal code is too long', () => {
      const result = postalCodeValidation('12345678910')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return invalid for a postal code including letters', () => {
      const result = postalCodeValidation('80331abc')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return invalid for a postal code including special characters', () => {
      const result = postalCodeValidation('80331 :!"/(')
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return valid for valid postal code with hyphen', () => {
      const result = postalCodeValidation('12345-213')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for valid postal code with empty space', () => {
      const result = postalCodeValidation('12345 213')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for a typical german postal code', () => {
      const result = postalCodeValidation('80331')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })
  })

  describe('descriptionValidation', () => {
    it('should return valid when description is undefined', () => {
      const result = descriptionValidation(undefined)
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid when description is empty', () => {
      const result = descriptionValidation('')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid when description is at maximum length', () => {
      const result = descriptionValidation('a'.repeat(2000))
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return length error when description exceeds maximum', () => {
      const result = descriptionValidation('a'.repeat(2001))
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return valid for short description', () => {
      const result = descriptionValidation('This is a short description')
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for long description', () => {
      const result = descriptionValidation('This is a long description '.repeat(30))
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })
  })

  describe('coordinatesInvalid', () => {
    it('should return true when latitude is undefined', () => {
      const result = coordinatesInvalid(undefined, 10.5)
      expect(result).toBe(true)
    })

    it('should return true when longitude is undefined', () => {
      const result = coordinatesInvalid(10.5, undefined)
      expect(result).toBe(true)
    })

    it('should return true when both coordinates are undefined', () => {
      const result = coordinatesInvalid(undefined, undefined)
      expect(result).toBe(true)
    })

    it('should return false when both coordinates are valid', () => {
      const result = coordinatesInvalid(48.1351, 11.582)
      expect(result).toBe(false)
    })

    it('should return false for zero coordinates', () => {
      const result = coordinatesInvalid(0, 0)
      expect(result).toBe(false)
    })

    it('should return false for negative coordinates', () => {
      const result = coordinatesInvalid(-48.1351, -11.582)
      expect(result).toBe(false)
    })
  })

  describe('categoryValidation', () => {
    it('should return required error when category is undefined', () => {
      const result = categoryValidation(undefined)
      expect(result.invalid).toBe(true)
      expect(result.message).not.toBeNull()
    })

    it('should return valid when category is provided', () => {
      const result = categoryValidation(1)
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for category with value 0', () => {
      const result = categoryValidation(0)
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })

    it('should return valid for large category ID', () => {
      const result = categoryValidation(999999)
      expect(result.invalid).toBe(false)
      expect(result.message).toBeNull()
    })
  })

  describe('isStoreFormInvalid', () => {
    const createValidStore = (): AcceptingStoreFormData => ({
      name: 'Valid Store',
      street: 'Main Street',
      houseNumber: '123',
      city: 'Munich',
      postalCode: '80331',
      descriptionDe: 'German description',
      descriptionEn: 'English description',
      latitude: 48.1351,
      longitude: 11.582,
      categoryId: 1,
      homepage: 'https://example.com',
      telephone: '0123456789',
      email: 'test@example.com',
    })

    it('should return false for completely valid store', () => {
      const store = createValidStore()
      const result = isStoreFormInvalid(store)
      expect(result).toBe(false)
    })
  })
})
