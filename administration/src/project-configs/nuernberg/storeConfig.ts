import { buildConfigNuernberg } from 'build-configs'

import { StoresManagement } from '../getProjectConfig'

const hasMandatoryValue = (value: string): boolean => value.length > 0
const isCoordinate = (coordinate: string) => !isNaN(parseFloat(coordinate))
const noValidationRequired = () => true
const hasValidCategoryId = (categoryId: string) => {
  const category = parseInt(categoryId)
  if (isNaN(category)) {
    return false
  }
  return buildConfigNuernberg.common.categories.includes(category)
}
export const storeConfig: StoresManagement = {
  enabled: true,
  fields: [
    { name: 'name', isMandatory: true, isValid: hasMandatoryValue, columnWidth: 400 },
    { name: 'street', isMandatory: true, isValid: hasMandatoryValue, columnWidth: 200 },
    { name: 'houseNumber', isMandatory: true, isValid: hasMandatoryValue, columnWidth: 150 },
    { name: 'postalCode', isMandatory: true, isValid: hasMandatoryValue, columnWidth: 150 },
    { name: 'location', isMandatory: true, isValid: hasMandatoryValue, columnWidth: 150 },
    { name: 'latitude', isMandatory: true, isValid: isCoordinate, columnWidth: 150 },
    { name: 'longitude', isMandatory: true, isValid: isCoordinate, columnWidth: 150 },
    { name: 'telephone', isMandatory: false, isValid: noValidationRequired, columnWidth: 200 },
    { name: 'email', isMandatory: false, isValid: noValidationRequired, columnWidth: 400 },
    { name: 'homepage', isMandatory: false, isValid: noValidationRequired, columnWidth: 400 },
    { name: 'discountDE', isMandatory: false, isValid: noValidationRequired, columnWidth: 500 },
    { name: 'discountEN', isMandatory: false, isValid: noValidationRequired, columnWidth: 500 },
    { name: 'categoryId', isMandatory: true, isValid: hasValidCategoryId, columnWidth: 100 },
  ],
}