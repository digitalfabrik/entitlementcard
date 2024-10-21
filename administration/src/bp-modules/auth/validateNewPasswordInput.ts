const isUpperCase = (value: string) => value === value.toUpperCase() && value !== value.toLowerCase()

const isLowerCase = (value: string) => value === value.toLowerCase() && value !== value.toUpperCase()

const isNumeric = (value: string) => !Number.isNaN(parseInt(value, 10))

const isSpecialChar = (value: string) => !isUpperCase(value) && !isLowerCase(value) && !isNumeric(value)

const getNumChars = (value: string, predicate: (char: string) => boolean): number =>
  value.split('').filter(predicate).length
const minPasswordLength = 12

const validateNewPasswordInput = (newPassword: string, repeatNewPassword: string): string | null => {
  if (newPassword.length < minPasswordLength) {
    return `Ihr Passwort muss mindestens ${minPasswordLength} Zeichen lang sein (aktuell ${newPassword.length}).`
  }
  if (getNumChars(newPassword, isLowerCase) < 1) {
    return 'Ihr Passwort muss mindestens einen Kleinbuchstaben enthalten.'
  }
  if (getNumChars(newPassword, isUpperCase) < 1) {
    return 'Ihr Passwort muss mindestens einen Großbuchstaben enthalten.'
  }
  if (getNumChars(newPassword, isSpecialChar) < 1) {
    return 'Ihr Passwort muss mindestens ein Sonderzeichen enthalten.'
  }
  if (newPassword !== repeatNewPassword) {
    return 'Die Passwörter stimmen nicht überein.'
  }
  return null
}

export default validateNewPasswordInput
