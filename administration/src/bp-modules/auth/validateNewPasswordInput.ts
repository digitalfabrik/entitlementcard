const isUpperCase = (value: string) => {
  return value === value.toUpperCase() && value !== value.toLowerCase()
}

const isLowerCase = (value: string) => {
  return value === value.toLowerCase() && value !== value.toUpperCase()
}

const isNumeric = (value: string) => {
  return !isNaN(parseInt(value))
}

const isSpecialChar = (value: string) => {
  return !isUpperCase(value) && !isLowerCase(value) && !isNumeric(value)
}

const getNumChars = (value: string, predicate: (char: string) => boolean): number => {
  return value.split('').filter(predicate).length
}
const minPasswordLength = 12

const validateNewPasswordInput = (newPassword: string, repeatNewPassword: string): string | null => {
  if (newPassword.length < minPasswordLength) {
    return `Ihr Passwort muss mindestens ${minPasswordLength} Zeichen lang sein (aktuell ${newPassword.length}).`
  } else if (getNumChars(newPassword, isLowerCase) < 1) {
    return 'Ihr Passwort muss mindestens einen Kleinbuchstaben enthalten.'
  } else if (getNumChars(newPassword, isUpperCase) < 1) {
    return 'Ihr Passwort muss mindestens einen Großbuchstaben enthalten.'
  } else if (getNumChars(newPassword, isSpecialChar) < 1) {
    return 'Ihr Passwort muss mindestens ein Sonderzeichen enthalten.'
  } else if (newPassword !== repeatNewPassword) {
    return 'Die Passwörter stimmen nicht überein.'
  }
  return null
}

export default validateNewPasswordInput
