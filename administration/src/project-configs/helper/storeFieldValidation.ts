export const hasMandatoryValue = (value: string): boolean => value.length > 0
export const isCoordinate = (coordinate: string): boolean => !Number.isNaN(parseFloat(coordinate))
export const noValidationRequired = (): boolean => true
const validDigitPattern = '^\\d+$'
export const isValidDigit = (value: string): boolean => new RegExp(validDigitPattern).test(value)
export const hasValidPostalCode = (value: string): boolean => hasMandatoryValue(value) && isValidDigit(value)
export const hasValidCategoryId = (categoryId: string, projectCategories: number[]): boolean => {
  const category = parseInt(categoryId, 10)
  if (Number.isNaN(category)) {
    return false
  }
  return projectCategories.includes(category)
}
