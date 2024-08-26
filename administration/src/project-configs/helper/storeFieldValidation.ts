export const hasMandatoryValue = (value: string): boolean => value.length > 0
export const isCoordinate = (coordinate: string) => !isNaN(parseFloat(coordinate))
export const noValidationRequired = () => true
export const hasValidCategoryId = (categoryId: string, projectCategories: number[]) => {
  const category = parseInt(categoryId)
  if (isNaN(category)) {
    return false
  }
  return projectCategories.includes(category)
}
