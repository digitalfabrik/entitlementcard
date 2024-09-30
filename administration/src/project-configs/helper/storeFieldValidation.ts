export const hasMandatoryValue = (value: string): boolean => value.length > 0
export const isCoordinate = (coordinate: string): boolean => !isNaN(parseFloat(coordinate))
export const noValidationRequired = (): boolean => true
export const hasValidCategoryId = (categoryId: string, projectCategories: number[]): boolean => {
  const category = parseInt(categoryId)
  if (isNaN(category)) {
    return false
  }
  return projectCategories.includes(category)
}
