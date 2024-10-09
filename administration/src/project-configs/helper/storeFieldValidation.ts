export const hasMandatoryValue = (value: string): boolean => value.length > 0
export const isCoordinate = (coordinate: string): boolean => !isNaN(parseFloat(coordinate))
export const noValidationRequired = (): boolean => true
export const isValidDigit = (value: string): boolean => new RegExp('^\\d+$').test(value)
export const hasValidPostalCode = (value: string): boolean => hasMandatoryValue(value) && isValidDigit(value)
export const hasValidCategoryId = (categoryId: string, projectCategories: number[]): boolean => {
  const category = parseInt(categoryId)
  if (isNaN(category) || !isValidDigit(categoryId)) {
    return false
  }
  return projectCategories.includes(category)
}
