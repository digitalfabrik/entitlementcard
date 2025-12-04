import React, { ReactElement } from 'react'
import { Trans } from 'react-i18next'

import { AcceptingStoreFormData } from '../../types'

export const DESCRIPTION_MAX_CHARS = 2000
const VALIDATION_CONSTANTS = {
  NAME: { min: 3, max: 150 },
  STREET: { min: 3, max: 100 },
  CITY: { min: 3, max: 100 },
  POSTAL_CODE: { LENGTH: 5 },
  PHONE: { min: 0, max: 100 },
  EMAIL: { min: 0, max: 100 },
  HOMEPAGE: { min: 0, max: 200 },
  DESCRIPTION: { min: 0, max: DESCRIPTION_MAX_CHARS },
}

const ADDRESS_REGEX = /^[a-zA-ZäöüÄÖÜß0-9\s.-]+$/
const PHONE_REGEX: RegExp = /^\+?\d+(?:[ \-./]?\d+)*$/
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+(?<!\.)@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]+$/

export type FormValidation = {
  invalid: boolean
  message: string | ReactElement | null
}

const requiredFieldError = (): FormValidation => ({
  invalid: true,
  message: <Trans i18nKey='storeForm:errorRequiredField' />,
})

const lengthError = (i18nKey: string, min: number, max: number): FormValidation => ({
  invalid: true,
  message: <Trans i18nKey={i18nKey} values={{ min, max }} />,
})

const validResult = (): FormValidation => ({
  invalid: false,
  message: null,
})

const specialCharacterError = (i18nKey: string): FormValidation => ({
  invalid: true,
  message: <Trans i18nKey={i18nKey} />,
})

const validateFieldWithLength = (
  value: string | undefined,
  { min, max }: { min: number; max: number },
  lengthErrorKey: string
): FormValidation => {
  const trimmedValue = value?.trim()
  if (!trimmedValue) {
    return min > 0 ? requiredFieldError() : validResult()
  }

  if (trimmedValue.length < min || trimmedValue.length > max) {
    return lengthError(lengthErrorKey, min, max)
  }

  return validResult()
}

export const nameValidation = (name: string | undefined): FormValidation =>
  validateFieldWithLength(name, VALIDATION_CONSTANTS.NAME, 'storeForm:errorNameInvalidMaxMinChars')

export const streetValidation = (street: string | undefined): FormValidation => {
  const lengthValidation = validateFieldWithLength(
    street,
    VALIDATION_CONSTANTS.STREET,
    'storeForm:errorStreetInvalidMaxMinChars'
  )

  if (lengthValidation.invalid) {
    return lengthValidation
  }

  if (!ADDRESS_REGEX.test(street!)) {
    return specialCharacterError('storeForm:errorStreetValidationSpecialCharacters')
  }
  return validResult()
}

export const phoneValidation = (phoneNr: string | undefined): FormValidation => {
  const lengthValidation = validateFieldWithLength(
    phoneNr,
    VALIDATION_CONSTANTS.PHONE,
    'storeForm:errorPhoneInvalidMaxMinChars'
  )

  if (lengthValidation.invalid) {
    return lengthValidation
  }

  if (phoneNr && !PHONE_REGEX.test(phoneNr)) {
    return specialCharacterError('storeForm:errorPhoneValidationSpecialCharacters')
  }
  return validResult()
}

export const emailValidation = (email: string | undefined): FormValidation => {
  const lengthValidation = validateFieldWithLength(
    email,
    VALIDATION_CONSTANTS.EMAIL,
    'storeForm:errorPhoneInvalidMaxMinChars'
  )

  if (lengthValidation.invalid) {
    return lengthValidation
  }

  if (email && !EMAIL_REGEX.test(email)) {
    return specialCharacterError('storeForm:errorEmailValidationSpecialCharacters')
  }
  return validResult()
}

export const cityValidation = (city: string | undefined): FormValidation => {
  const lengthValidation = validateFieldWithLength(
    city,
    VALIDATION_CONSTANTS.CITY,
    'storeForm:errorCityInvalidMaxMinChars'
  )

  if (lengthValidation.invalid) {
    return lengthValidation
  }

  if (!ADDRESS_REGEX.test(city!)) {
    return specialCharacterError('storeForm:errorCityValidationSpecialCharacters')
  }
  return validResult()
}

export const homepageValidation = (homepage: string | undefined): FormValidation => {
  if (!homepage) {
    return validResult()
  }
  const lengthValidation = validateFieldWithLength(
    homepage,
    VALIDATION_CONSTANTS.HOMEPAGE,
    'storeForm:errorHomepageInvalidMaxMinChars'
  )

  if (lengthValidation.invalid) {
    return lengthValidation
  }

  try {
    // eslint-disable-next-line no-new
    new URL(homepage)
    return validResult()
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

  if (postalCode.length !== VALIDATION_CONSTANTS.POSTAL_CODE.LENGTH) {
    return {
      invalid: true,
      message: (
        <Trans
          i18nKey='storeForm:errorPostalCodeInvalidLength'
          values={{ length: VALIDATION_CONSTANTS.POSTAL_CODE.LENGTH }}
        />
      ),
    }
  }
  return validResult()
}

export const descriptionValidation = (description?: string): FormValidation =>
  validateFieldWithLength(description, VALIDATION_CONSTANTS.DESCRIPTION, 'storeForm:errorDescriptionInvalidMaxChars')

export const coordinatesInvalid = (latitude?: number, longitude?: number): boolean =>
  latitude === undefined || longitude === undefined

export const isStoreFormInvalid = (acceptingStore: AcceptingStoreFormData): boolean =>
  [
    nameValidation(acceptingStore.name).invalid,
    streetValidation(acceptingStore.street).invalid,
    cityValidation(acceptingStore.city).invalid,
    descriptionValidation(acceptingStore.descriptionDe).invalid,
    descriptionValidation(acceptingStore.descriptionEn).invalid,
    coordinatesInvalid(acceptingStore.latitude, acceptingStore.longitude),
    homepageValidation(acceptingStore.homepage).invalid,
    phoneValidation(acceptingStore.telephone).invalid,
    emailValidation(acceptingStore.email).invalid,
  ].some(Boolean)
