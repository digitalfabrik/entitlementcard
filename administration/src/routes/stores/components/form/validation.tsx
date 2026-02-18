import React, { ReactElement } from 'react'
import { Trans } from 'react-i18next'
import XRegExp from 'xregexp'

import { isEmailValid } from '../../../../util/verifications'
import { AcceptingStoreFormData } from '../../types'

export const descriptionMaxChars = 2000
const validationConstants = {
  name: { min: 3, max: 150 },
  street: { min: 3, max: 100 },
  houseNumber: { min: 1, max: 10 },
  city: { min: 3, max: 100 },
  postal_code: { length: 5 },
  phone: { min: 0, max: 100 },
  email: { min: 0, max: 100 },
  homepage: { min: 0, max: 200 },
  description: { min: 0, max: descriptionMaxChars },
}

const PHONE_REGEX: RegExp = /^\+?\d+(?:[ \-./]?\d+)*$/
const HOUSE_NUMBER_SPECIAL_CHARS_REGEX = XRegExp(String.raw`^[\p{Letter}\p{Number}\.,+'\-/() ]+$`)
const HOUSE_NUMBER_CONTAINS_NUMBER_REGEX = XRegExp(String.raw`\p{Number}`)
const CITY_REGEX = XRegExp(String.raw`^[\p{Letter}\.,'/() -]+$`)
const STREET_REGEX = XRegExp(String.raw`^[\p{Letter}\p{Number}\.,'/() -]+$`)

export type FormValidation = {
  readonly invalid: boolean
  readonly message: string | ReactElement | null
}

const requiredFieldError = (): FormValidation => ({
  invalid: true,
  message: <Trans i18nKey='storeForm:errorRequiredField' />,
})

const lengthError = (i18nKey: string, min: number, max: number): FormValidation => ({
  invalid: true,
  message: <Trans i18nKey={i18nKey} values={{ min, max }} />,
})

const validResult: FormValidation = {
  invalid: false,
  message: null,
}

const specialCharacterError = (i18nKey: string): FormValidation => ({
  invalid: true,
  message: <Trans i18nKey={i18nKey} />,
})

const validateFieldWithLength = (
  value: string | undefined,
  { min, max }: { min: number; max: number },
  lengthErrorKey: string,
): FormValidation => {
  const trimmedValue = value?.trim()
  if (!trimmedValue) {
    return min > 0 ? requiredFieldError() : validResult
  }

  if (trimmedValue.length < min || trimmedValue.length > max) {
    return lengthError(lengthErrorKey, min, max)
  }

  return validResult
}

export const nameValidation = (name: string | undefined): FormValidation =>
  validateFieldWithLength(name, validationConstants.name, 'storeForm:errorNameInvalidMaxMinChars')

export const streetValidation = (street: string | undefined): FormValidation => {
  const lengthValidation = validateFieldWithLength(
    street,
    validationConstants.street,
    'storeForm:errorStreetInvalidMaxMinChars',
  )

  if (lengthValidation.invalid) {
    return lengthValidation
  }

  if (!STREET_REGEX.test(street!)) {
    return specialCharacterError('storeForm:errorStreetValidationSpecialCharacters')
  }
  return validResult
}

export const houseNumberValidation = (houseNumber: string | undefined): FormValidation => {
  const lengthValidation = validateFieldWithLength(
    houseNumber,
    validationConstants.houseNumber,
    'storeForm:errorHouseNumberInvalidMaxMinChars',
  )

  if (lengthValidation.invalid) {
    return lengthValidation
  }

  if (!HOUSE_NUMBER_CONTAINS_NUMBER_REGEX.test(houseNumber!)) {
    return specialCharacterError('storeForm:errorHouseNumberValidationNoNumber')
  }

  if (!HOUSE_NUMBER_SPECIAL_CHARS_REGEX.test(houseNumber!)) {
    return specialCharacterError('storeForm:errorHouseNumberValidationSpecialCharacters')
  }
  return validResult
}

export const phoneValidation = (phoneNr: string | undefined): FormValidation => {
  const lengthValidation = validateFieldWithLength(
    phoneNr,
    validationConstants.phone,
    'storeForm:errorPhoneInvalidMaxChars',
  )

  if (lengthValidation.invalid) {
    return lengthValidation
  }

  if (phoneNr && !PHONE_REGEX.test(phoneNr)) {
    return specialCharacterError('storeForm:errorPhoneValidationSpecialCharacters')
  }
  return validResult
}

export const emailValidation = (email: string | undefined): FormValidation => {
  const lengthValidation = validateFieldWithLength(
    email,
    validationConstants.email,
    'storeForm:errorEmailInvalidMaxChars',
  )

  if (lengthValidation.invalid) {
    return lengthValidation
  }

  if (email && !isEmailValid(email)) {
    return specialCharacterError('storeForm:errorEmailValidationSpecialCharacters')
  }
  return validResult
}

export const cityValidation = (city: string | undefined): FormValidation => {
  const lengthValidation = validateFieldWithLength(
    city,
    validationConstants.city,
    'storeForm:errorCityInvalidMaxMinChars',
  )

  if (lengthValidation.invalid) {
    return lengthValidation
  }

  if (!CITY_REGEX.test(city!)) {
    return specialCharacterError('storeForm:errorCityValidationSpecialCharacters')
  }
  return validResult
}

export const homepageValidation = (homepage: string | undefined): FormValidation => {
  if (!homepage) {
    return validResult
  }
  const lengthValidation = validateFieldWithLength(
    homepage,
    validationConstants.homepage,
    'storeForm:errorHomepageInvalidMaxMinChars',
  )

  if (lengthValidation.invalid) {
    return lengthValidation
  }

  try {
    const url = new URL(homepage)
    if (!homepage.includes('//') || !url.protocol || !url.host) {
      return {
        invalid: true,
        message: <Trans i18nKey='storeForm:errorHomepageInvalidUrl' />,
      }
    }
    return validResult
  } catch {
    return {
      invalid: true,
      message: <Trans i18nKey='storeForm:errorHomepageInvalidUrl' />,
    }
  }
}

export const postalCodeValidation = (postalCode: string | undefined): FormValidation => {
  if (!postalCode) {
    return requiredFieldError()
  }

  if (postalCode.length !== validationConstants.postal_code.length) {
    return {
      invalid: true,
      message: (
        <Trans
          i18nKey='storeForm:errorPostalCodeInvalidLength'
          values={{ length: validationConstants.postal_code.length }}
        />
      ),
    }
  }
  return validResult
}

export const descriptionValidation = (description?: string): FormValidation =>
  validateFieldWithLength(
    description,
    validationConstants.description,
    'storeForm:errorDescriptionMaxChars',
  )

export const coordinatesInvalid = (latitude?: number, longitude?: number): boolean =>
  latitude === undefined || longitude === undefined

export const categoryValidation = (categoryId: number | undefined): FormValidation =>
  categoryId === undefined ? requiredFieldError() : validResult

export const isAddressInvalid = (acceptingStore: AcceptingStoreFormData): boolean =>
  [
    houseNumberValidation(acceptingStore.houseNumber).invalid,
    streetValidation(acceptingStore.street).invalid,
    cityValidation(acceptingStore.city).invalid,
    postalCodeValidation(acceptingStore.postalCode).invalid,
  ].some(Boolean)

export const isStoreFormInvalid = (acceptingStore: AcceptingStoreFormData): boolean =>
  [
    nameValidation(acceptingStore.name).invalid,
    descriptionValidation(acceptingStore.descriptionDe).invalid,
    descriptionValidation(acceptingStore.descriptionEn).invalid,
    coordinatesInvalid(acceptingStore.latitude, acceptingStore.longitude),
    categoryValidation(acceptingStore.categoryId).invalid,
    homepageValidation(acceptingStore.homepage).invalid,
    phoneValidation(acceptingStore.telephone).invalid,
    emailValidation(acceptingStore.email).invalid,
    isAddressInvalid(acceptingStore),
  ].some(Boolean)
