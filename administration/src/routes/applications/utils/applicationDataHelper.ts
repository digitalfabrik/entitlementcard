import { Intl, Temporal } from 'temporal-polyfill'

import { JsonField, findValue } from '../../../components/JsonFieldView'

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

  const dateOfBirth = findValue(personalData, 'dateOfBirth', 'Date')?.value

  return {
    forenames: findValue(personalData, 'forenames', 'String')?.value,
    surname: findValue(personalData, 'surname', 'String')?.value,
    emailAddress: findValue(personalData, 'emailAddress', 'String')?.value,
    dateOfBirth: dateOfBirth
      ? Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(
          Temporal.PlainDate.from(dateOfBirth),
        )
      : '',
    telephone: findValue(personalData, 'telephone', 'String')?.value,
  }
}

export const getAddressApplicationData = (json: JsonField<'Array'>): AddressApplicationData => {
  const personalData = findValue(json, 'personalData', 'Array')
  if (!personalData) {
    throw new ApplicationDataIncompleteError('personalData not found')
  }

  const addressData = findValue(personalData, 'address', 'Array')
  if (!addressData) {
    throw new ApplicationDataIncompleteError('addressData not found')
  }

  return {
    street: findValue(addressData, 'street', 'String')?.value,
    addressSupplement: findValue(addressData, 'addressSupplement', 'String')?.value,
    houseNumber: findValue(addressData, 'houseNumber', 'String')?.value,
    postalCode: findValue(addressData, 'postalCode', 'String')?.value,
    location: findValue(addressData, 'location', 'String')?.value,
  }
}

export const getCardTypeApplicationData = (json: JsonField<'Array'>): CardTypeApplicationData => {
  const applicationDetails = findValue(json, 'applicationDetails', 'Array')
  if (!applicationDetails) {
    throw new ApplicationDataIncompleteError('applicationDetails not found')
  }

  return { cardType: findValue(applicationDetails, 'cardType', 'String')?.value }
}
