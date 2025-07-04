import { JsonField, findValue } from '../bp-modules/applications/JsonFieldView'
import { formatDate } from './formatDate'

export type PersonalApplicationData = {
  forenames: string | undefined
  surname: string | undefined
  emailAddress: string | undefined
  dateOfBirth: string | undefined
  telephone: string | undefined
}

export type AddressApplicationData = {
  street: string | undefined
  addressSupplement: string | undefined
  houseNumber: string | undefined
  postalCode: string | undefined
  location: string | undefined
}

export type CardTypeApplicationData = {
  cardType: string | undefined
}

export type CreationDateApplicationData = {
  creationDate: string | undefined
}

export class ApplicationDataIncompleteError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApplicationDataIncompleteError'
  }
}

export const getPersonalApplicationData = (json: JsonField<'Array'>): PersonalApplicationData => {
  const personalData = findValue(json, 'personalData', 'Array')
  if (!personalData) {
    throw new ApplicationDataIncompleteError('personalData not found')
  }
  const forenames = findValue(personalData, 'forenames', 'String')?.value
  const surname = findValue(personalData, 'surname', 'String')?.value
  const emailAddress = findValue(personalData, 'emailAddress', 'String')?.value
  const dateOfBirth = findValue(personalData, 'dateOfBirth', 'Date')?.value
  const telephone = findValue(personalData, 'telephone', 'String')?.value
  return { forenames, surname, emailAddress, dateOfBirth: dateOfBirth ? formatDate(dateOfBirth) : '', telephone }
}

export const getAddressApplicationData = (json: JsonField<'Array'>): AddressApplicationData => {
  const personalData = findValue(json, 'personalData', 'Array')
  if (!personalData) {
    throw new ApplicationDataIncompleteError('personalData not found')
  }
  const addressData = findValue(personalData, 'address', 'Array')

  if (!addressData) {
    throw new ApplicationDataIncompleteError('addressData  not found')
  }

  const street = findValue(addressData, 'street', 'String')?.value
  const addressSupplement = findValue(addressData, 'addressSupplement', 'String')?.value
  const houseNumber = findValue(addressData, 'houseNumber', 'String')?.value
  const postalCode = findValue(addressData, 'postalCode', 'String')?.value
  const location = findValue(addressData, 'location', 'String')?.value
  return { street, addressSupplement, houseNumber, postalCode, location }
}

export const getCardTypeApplicationData = (json: JsonField<'Array'>): CardTypeApplicationData => {
  const applicationDetails = findValue(json, 'applicationDetails', 'Array')
  if (!applicationDetails) {
    throw new ApplicationDataIncompleteError('applicationDetails not found')
  }
  const cardType = findValue(applicationDetails, 'cardType', 'String')?.value
  return { cardType }
}
