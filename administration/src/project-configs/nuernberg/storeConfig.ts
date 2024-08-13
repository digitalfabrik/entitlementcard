import { StoresManagement } from '../getProjectConfig'

const hasMandatoryValue = (value: string): boolean => value.length > 0
const isCoordinate = (value: string) => !isNaN(parseFloat(value))
const noValidation = () => true
export const storeConfig: StoresManagement = {
  enabled: true,
  fields: [
    { name: 'name', isMandatory: true, isValid: hasMandatoryValue },
    { name: 'street', isMandatory: true, isValid: hasMandatoryValue },
    { name: 'houseNumber', isMandatory: true, isValid: hasMandatoryValue },
    { name: 'postalCode', isMandatory: true, isValid: hasMandatoryValue },
    { name: 'location', isMandatory: true, isValid: hasMandatoryValue },
    { name: 'latitude', isMandatory: true, isValid: isCoordinate },
    { name: 'longitude', isMandatory: true, isValid: isCoordinate },
    { name: 'telephone', isMandatory: false, isValid: noValidation },
    { name: 'email', isMandatory: false, isValid: noValidation },
    { name: 'homepage', isMandatory: false, isValid: noValidation },
    { name: 'discountDE', isMandatory: false, isValid: noValidation },
    { name: 'discountEN', isMandatory: false, isValid: noValidation },
    { name: 'categoryId', isMandatory: true, isValid: hasMandatoryValue },
  ],
}
